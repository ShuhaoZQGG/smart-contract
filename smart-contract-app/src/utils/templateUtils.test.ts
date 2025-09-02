import { extractVariables, replaceVariables } from './templateUtils'

describe('Template Utils', () => {
  describe('extractVariables', () => {
    it('should extract single variable', () => {
      const content = 'Hello {{name}}!'
      const variables = extractVariables(content)
      expect(variables).toEqual(['name'])
    })

    it('should extract multiple variables', () => {
      const content = 'Dear {{firstName}} {{lastName}}, your order {{orderId}} is ready.'
      const variables = extractVariables(content)
      expect(variables).toEqual(['firstName', 'lastName', 'orderId'])
    })

    it('should extract unique variables only', () => {
      const content = 'Hello {{name}}, {{name}} is a great {{name}}!'
      const variables = extractVariables(content)
      expect(variables).toEqual(['name'])
    })

    it('should return empty array for no variables', () => {
      const content = 'Hello world!'
      const variables = extractVariables(content)
      expect(variables).toEqual([])
    })
  })

  describe('replaceVariables', () => {
    it('should replace single variable', () => {
      const template = 'Hello {{name}}!'
      const variables = { name: 'John' }
      const result = replaceVariables(template, variables)
      expect(result).toBe('Hello John!')
    })

    it('should replace multiple variables', () => {
      const template = 'Dear {{firstName}} {{lastName}}, your order {{orderId}} is ready.'
      const variables = {
        firstName: 'John',
        lastName: 'Doe',
        orderId: '12345'
      }
      const result = replaceVariables(template, variables)
      expect(result).toBe('Dear John Doe, your order 12345 is ready.')
    })

    it('should replace repeated variables', () => {
      const template = 'Hello {{name}}, {{name}} is here!'
      const variables = { name: 'Jane' }
      const result = replaceVariables(template, variables)
      expect(result).toBe('Hello Jane, Jane is here!')
    })

    it('should handle missing variables', () => {
      const template = 'Hello {{name}} {{lastName}}!'
      const variables = { name: 'John' }
      const result = replaceVariables(template, variables)
      expect(result).toBe('Hello John {{lastName}}!')
    })
  })
})