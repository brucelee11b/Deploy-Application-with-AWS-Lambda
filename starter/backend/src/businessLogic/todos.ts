import { TodosAccess } from '../dataAccessLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAcess = new TodosAccess()

// Create Todo
export async function createTodo(newTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {
    logger.info("Create Todo")
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    const newTodoItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: s3AttachmentUrl,
        ...newTodo
    }

    return await todosAcess.createTodoItem(newTodoItem)
}

// Get todo
export async function getTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Info-> Start get todo by user')
    return todosAcess.getAllTodos(userId)
}

// Update todo
export async function updateTodo(
    todoId: string,
    todoUpdate: UpdateTodoRequest,
    userId: string): Promise<TodoUpdate> {
    logger.info('Info->Start handle update todo method')
    return todosAcess.updateTodoItem(todoId, userId, todoUpdate)
}




//Create url
export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    logger.info('Info-> Create attachment method by: ', userId, todoId)
    return attachmentUtils.getUploadUrl(todoId)
}

// Delete todo
export async function deleteTodo(
    todoId: string,
    userId: string): Promise<string> {
    logger.info('Info-> Start handle delete todo method')
    return todosAcess.deleteTodoItem(todoId, userId)
}