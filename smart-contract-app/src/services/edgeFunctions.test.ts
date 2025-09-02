import { edgeFunctions } from './edgeFunctions'

// Mock Supabase client
jest.mock('../lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn().mockImplementation((functionName, { body }) => {
        const parsedBody = JSON.parse(body);
        
        if (parsedBody.action === 'extractVariables') {
          const { content } = parsedBody;
          const regex = /\{\{(\w+)\}\}/g;
          const matches = content.matchAll(regex);
          const variableMap = new Map();
          let position = 0;
          
          for (const match of matches) {
            const varName = match[1];
            if (!variableMap.has(varName)) {
              variableMap.set(varName, position++);
            }
          }
          
          const variables = Array.from(variableMap.entries()).map(([name, pos]) => ({
            name,
            display_name: name.replace(/_/g, ' '),
            data_type: 'text',
            position: pos,
            is_required: true
          }));
          
          return Promise.resolve({
            data: { success: true, variables, count: variables.length },
            error: null
          });
        }
        
        if (parsedBody.action === 'processTemplate') {
          return Promise.resolve({
            data: { success: true, version: 1, variables: [] },
            error: null
          });
        }
        
        if (parsedBody.action === 'generateDocument') {
          return Promise.resolve({
            data: { 
              success: true, 
              downloadUrl: `https://example.com/download.${parsedBody.outputFormat || 'docx'}`,
              path: 'generated/doc.docx'
            },
            error: null
          });
        }
        
        if (parsedBody.action === 'bulkGenerate') {
          const documents = parsedBody.csvData.map(() => ({
            path: 'generated/doc.docx',
            variables: {}
          }));
          
          return Promise.resolve({
            data: { success: true, documents, count: documents.length },
            error: null
          });
        }
        
        return Promise.resolve({ data: null, error: null });
      })
    },
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          data: { path: 'templates/test.docx' },
          error: null
        }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/file.docx' }
        })
      })
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: [], error: null })
    })
  }
}));

describe('EdgeFunctions Service', () => {
  describe('extractVariables', () => {
    it('should extract variables from template content', async () => {
      const content = 'This agreement is between {{client_name}} and {{company_name}}.'
      const result = await edgeFunctions.extractVariables(content)
      
      expect(result.success).toBe(true)
      expect(result.variables).toHaveLength(2)
      expect(result.variables?.[0].name).toBe('client_name')
      expect(result.variables?.[1].name).toBe('company_name')
    })

    it('should handle content with no variables', async () => {
      const content = 'This is plain text without variables.'
      const result = await edgeFunctions.extractVariables(content)
      
      expect(result.success).toBe(true)
      expect(result.variables).toHaveLength(0)
    })

    it('should handle duplicate variables', async () => {
      const content = '{{name}} agrees that {{name}} will pay {{amount}}.'
      const result = await edgeFunctions.extractVariables(content)
      
      expect(result.success).toBe(true)
      expect(result.variables).toHaveLength(2)
      expect(result.variables?.map(v => v.name)).toEqual(['name', 'amount'])
    })
  })

  describe('processTemplate', () => {
    it('should process template and save version', async () => {
      const templateId = 'test-template-id'
      const content = 'Agreement for {{client_name}}'
      const userId = 'test-user-id'
      
      const result = await edgeFunctions.processTemplate(templateId, content, userId)
      
      expect(result.success).toBe(true)
      expect(result.version).toBeGreaterThan(0)
      expect(result.variables).toBeDefined()
    })
  })

  describe('generateDocument', () => {
    it('should generate document with variable substitution', async () => {
      const params = {
        templateId: 'test-template-id',
        variableValues: {
          client_name: 'John Doe',
          company_name: 'ACME Corp'
        },
        userId: 'test-user-id',
        outputFormat: 'docx' as const
      }
      
      const result = await edgeFunctions.generateDocument(params)
      
      expect(result.success).toBe(true)
      expect(result.downloadUrl).toBeDefined()
      expect(result.path).toBeDefined()
    })

    it('should support PDF output format', async () => {
      const params = {
        templateId: 'test-template-id',
        variableValues: {
          client_name: 'Jane Smith'
        },
        userId: 'test-user-id',
        outputFormat: 'pdf' as const
      }
      
      const result = await edgeFunctions.generateDocument(params)
      
      expect(result.success).toBe(true)
      expect(result.downloadUrl).toContain('.pdf')
    })
  })

  describe('bulkGenerate', () => {
    it('should generate multiple documents from CSV data', async () => {
      const csvData = [
        { client_name: 'John Doe', amount: '1000' },
        { client_name: 'Jane Smith', amount: '2000' },
        { client_name: 'Bob Johnson', amount: '1500' }
      ]
      
      const result = await edgeFunctions.bulkGenerate({
        templateId: 'test-template-id',
        csvData,
        userId: 'test-user-id',
        outputFormat: 'docx'
      })
      
      expect(result.success).toBe(true)
      expect(result.documents).toHaveLength(3)
      expect(result.count).toBe(3)
    })

    it('should handle empty CSV data', async () => {
      const result = await edgeFunctions.bulkGenerate({
        templateId: 'test-template-id',
        csvData: [],
        userId: 'test-user-id',
        outputFormat: 'docx'
      })
      
      expect(result.success).toBe(true)
      expect(result.documents).toHaveLength(0)
      expect(result.count).toBe(0)
    })
  })
})