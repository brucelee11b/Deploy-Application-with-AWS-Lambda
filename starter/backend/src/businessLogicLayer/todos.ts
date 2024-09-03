import { TodosAccess } from '../dataAccessLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
//import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAcess = new TodosAccess()

/**
 * getTodosForUser.
 * 
 * @param userId UserId
 * @returns TodoItem[]
 */
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Get todo for user function')
    return todosAcess.getAllTodos(userId)
}
/**
 * createTodo.
 * 
 * @param newTodo NewTodo
 * @param userId UserId
 * @returns newItem TodoItem
 */
export async function createTodo(newTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {
    logger.info("Create todo function")

    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    const newItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: s3AttachmentUrl,
        ...newTodo
    }

    return await todosAcess.createTodoItem(newItem)
}

/**
 * updateTodo.
 * 
 * @param todoId TodoId
 * @param userId UserId
 * @param todoUpdate TodoUpdate
 * @returns 
 */
export async function updateTodo(
    todoId: string,
    todoUpdate: UpdateTodoRequest,
    userId: string): Promise<TodoUpdate> {
    logger.info('Update todo function')
    return todosAcess.updateTodoItem(todoId, userId, todoUpdate)
}

/**
 * deleteTodo
 * 
 * @param todoId TodoId
 * @param userId UserId
 * @returns string
 */
export async function deleteTodo(
    todoId: string,
    userId: string): Promise<string> {
    logger.info('Delete todo function')
    return todosAcess.deleteTodoItem(todoId, userId)
}

/**
 * createAttachmentPresignedUrl.
 * 
 * @param todoId TodoId
 * @param userId UserId
 * @returns string
 */
export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    logger.info('Create attachment presigned url function by: ', userId, todoId)
    return attachmentUtils.getUploadUrl(todoId)
}