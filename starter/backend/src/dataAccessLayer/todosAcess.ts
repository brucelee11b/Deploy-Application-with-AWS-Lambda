import * as AWS from 'aws-sdk'
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
        private readonly tableName = process.env.TODOS_TABLE,
        private readonly indexName = process.env.INDEX_NAME
    ) { }

    // Get todo
    async getAllTodos(userId: string): Promise<TodoItem[]> {
       
        const result = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.indexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })
            .promise()
        const items = result.Items
        return items as TodoItem[]
    }

    // Create todo
    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        const result = await this.docClient
            .put({
                TableName: this.tableName,
                Item: todoItem
            })
            .promise()
        return todoItem as TodoItem
    }

    // Update todo
    async updateTodoItem(todoId: string, userId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> {
        
        const result = await this.docClient.update({
            TableName: this.tableName,
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
        return updateItem as TodoUpdate
    }

    //  Delete item
    async deleteTodoItem(todoId: string, userId: string): Promise<string> {
        const result = await this.docClient.delete({
            TableName: this.tableName,
            Key: {
                todoId,
                userId
            }
        }).promise()
        return todoId as string
    }
}