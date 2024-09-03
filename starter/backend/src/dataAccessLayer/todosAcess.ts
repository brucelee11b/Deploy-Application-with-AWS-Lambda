import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('dataAccessLayer/todosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.INDEX_NAME
    ) { }

    /**
     * getAllTodos.
     * 
     * @param userId UserId
     * @returns items TodoItem[]
     */
    async getAllTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Call function get all todos start')
        logger.info(`Get get all todos for user ${userId} from ${this.todosTable} table.`)

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })
            .promise()

        const items = result.Items
        logger.info(`Found ${items.length} todos for the user with UserId: ${userId} in ${this.todosTable} table.`)
        logger.info('Call functuin get all todos end.')
        return items as TodoItem[]
    }

    /**
     * createTodoItem.
     * 
     * @param todoItem TodoItem
     * @returns todoItem TodoItem
     */
    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('Call function create todos start')
        logger.info(`Putting todo ${todoItem.todoId} into ${this.todosTable} table.`)

        const result = await this.docClient
            .put({
                TableName: this.todosTable,
                Item: todoItem
            })
            .promise()
        logger.info('Todo item create', result)
        logger.info('Call function create todos emd')
        return todoItem as TodoItem
    }

    /**
     * updateTodoItem.
     * 
     * @param userId UserId
     * @param todoId TodoId
     * @param todoUpdate TodoUpdate
     */
    async updateTodoItem(todoId: string, userId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> {
        logger.info('Call function update todos item start')
        logger.info(`Update todo item with ID: ${todoId} in ${this.todosTable} table.`)

        const result = await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
                "#name": "name"
            },
            ExpressionAttributeValues: {
                ":name": todoUpdate.name,
                ":dueDate": todoUpdate.dueDate,
                ":done": todoUpdate.done
            },
            ReturnValues: 'ALL_NEW'
        }).promise()
        const updateItem = result.Attributes
        logger.info('Call function update todos item end', updateItem)
        return updateItem as TodoUpdate
    }

    /**
     * deleteTodoItem.
     * 
     * @param todoId TodoID
     * @param userId UserId
     * @returns string
     */
    async deleteTodoItem(todoId: string, userId: string): Promise<string> {
        logger.info('Call function delete todos item start')
        logger.info(`Delete todo item with ID: ${todoId} from ${this.todosTable} table.`)

        const result = await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            }
        }).promise()
        logger.info('Todo deleted item', result)
        logger.info('Call function delete todos item end')
        return todoId as string
    }
}