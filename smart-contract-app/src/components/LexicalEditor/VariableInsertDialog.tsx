import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Variable } from 'lucide-react';

interface VariableInsertDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (variableName: string, variableType: string) => void;
  existingVariables: string[];
}

export function VariableInsertDialog({
  open,
  onClose,
  onInsert,
  existingVariables,
}: VariableInsertDialogProps) {
  const [variableName, setVariableName] = useState('');
  const [variableType, setVariableType] = useState('text');
  const [useExisting, setUseExisting] = useState(false);
  const [selectedExisting, setSelectedExisting] = useState('');

  const handleInsert = () => {
    const nameToInsert = useExisting ? selectedExisting : variableName;
    if (nameToInsert.trim()) {
      onInsert(nameToInsert.trim(), variableType);
      setVariableName('');
      setSelectedExisting('');
      setUseExisting(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Variable className="h-5 w-5" />
            Insert Variable
          </DialogTitle>
          <DialogDescription>
            Add a variable placeholder that will be replaced with actual values when generating documents.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {existingVariables.length > 0 && (
            <div className="space-y-2">
              <Label>Existing Variables</Label>
              <div className="flex flex-wrap gap-2">
                {existingVariables.map((variable) => (
                  <Badge
                    key={variable}
                    variant={selectedExisting === variable && useExisting ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedExisting(variable);
                      setUseExisting(true);
                      setVariableName('');
                    }}
                  >
                    {`{{${variable}}}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={useExisting ? selectedExisting : variableName}
              onChange={(e) => {
                setVariableName(e.target.value);
                setUseExisting(false);
                setSelectedExisting('');
              }}
              placeholder="client_name"
              className="col-span-3"
              autoFocus
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select value={variableType} onValueChange={setVariableType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select variable type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="currency">Currency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-muted-foreground">
            This will insert: <code className="bg-muted px-2 py-1 rounded">{`{{${useExisting ? selectedExisting : variableName || 'variable_name'}}}`}</code>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleInsert}
            disabled={!useExisting && !variableName.trim()}
          >
            Insert Variable
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}