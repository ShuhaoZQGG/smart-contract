import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import {
  FileText,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
} from 'lucide-react';
import { Variable } from '../types';

interface DocumentGenerationFormProps {
  templateId: string;
  templateName: string;
  variables: Variable[];
  onGenerate: (values: Record<string, any>, format: 'pdf' | 'docx') => Promise<void>;
  onPreview?: (values: Record<string, any>) => void;
}

// Create dynamic schema based on variables
const createFormSchema = (variables: Variable[]) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};
  
  variables.forEach((variable) => {
    switch (variable.type) {
      case 'number':
        schemaObject[variable.name] = z.string().transform((val) => Number(val));
        break;
      case 'date':
        schemaObject[variable.name] = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
          message: 'Please enter a valid date (YYYY-MM-DD)',
        });
        break;
      case 'email':
        schemaObject[variable.name] = z.string().email({
          message: 'Please enter a valid email address',
        });
        break;
      case 'phone':
        schemaObject[variable.name] = z.string().regex(/^[\d\s\-\+\(\)]+$/, {
          message: 'Please enter a valid phone number',
        });
        break;
      case 'currency':
        schemaObject[variable.name] = z.string().regex(/^\d+(\.\d{1,2})?$/, {
          message: 'Please enter a valid amount',
        });
        break;
      default:
        schemaObject[variable.name] = z.string().min(1, {
          message: `${variable.displayName || variable.name} is required`,
        });
    }
  });
  
  return z.object(schemaObject);
};

export function DocumentGenerationForm({
  templateId,
  templateName,
  variables,
  onGenerate,
  onPreview,
}: DocumentGenerationFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'docx'>('pdf');
  const [activeTab, setActiveTab] = useState('single');
  
  const formSchema = createFormSchema(variables);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: variables.reduce((acc, variable) => {
      acc[variable.name] = variable.defaultValue || '';
      return acc;
    }, {} as Record<string, string>),
  });
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationSuccess(false);
    
    try {
      await onGenerate(values, selectedFormat);
      setGenerationSuccess(true);
      setTimeout(() => setGenerationSuccess(false), 5000);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handlePreview = () => {
    if (onPreview) {
      const values = form.getValues();
      onPreview(values);
    }
  };
  
  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'email':
        return '✉️';
      case 'phone':
        return '📞';
      case 'date':
        return '📅';
      case 'currency':
        return '💰';
      case 'number':
        return '🔢';
      default:
        return '📝';
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Document
            </CardTitle>
            <CardDescription>
              Template: {templateName}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{variables.length} variables</Badge>
            <Badge variant="outline">{templateId}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Document</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Generation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single" className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {variables.map((variable) => (
                    <FormField
                      key={variable.name}
                      control={form.control}
                      name={variable.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <span>{getFieldIcon(variable.type)}</span>
                            {variable.displayName || variable.name}
                          </FormLabel>
                          {variable.type === 'text' && variable.maxLength && variable.maxLength > 100 ? (
                            <FormControl>
                              <Textarea
                                placeholder={`Enter ${variable.displayName || variable.name}`}
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                          ) : (
                            <FormControl>
                              <Input
                                type={
                                  variable.type === 'date' ? 'date' :
                                  variable.type === 'email' ? 'email' :
                                  variable.type === 'phone' ? 'tel' :
                                  variable.type === 'number' || variable.type === 'currency' ? 'number' :
                                  'text'
                                }
                                placeholder={`Enter ${variable.displayName || variable.name}`}
                                {...field}
                              />
                            </FormControl>
                          )}
                          {variable.description && (
                            <FormDescription>{variable.description}</FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Format:</label>
                    <Select value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as 'pdf' | 'docx')}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="docx">DOCX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    {onPreview && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePreview}
                        disabled={isGenerating}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    )}
                    <Button type="submit" disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Generate {selectedFormat.toUpperCase()}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
            
            {generationSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Document generated successfully! Check your downloads.
                </AlertDescription>
              </Alert>
            )}
            
            {generationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{generationError}</AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="bulk" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Upload a CSV file with columns matching the variable names to generate multiple documents at once.
                Required columns: {variables.map(v => v.name).join(', ')}
              </AlertDescription>
            </Alert>
            
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your CSV file here, or click to browse
              </p>
              <Button variant="outline">
                Select CSV File
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <Button variant="outline" className="gap-2">
                <Copy className="h-4 w-4" />
                Download Sample CSV
              </Button>
              <Button disabled>
                <Download className="mr-2 h-4 w-4" />
                Generate All
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}