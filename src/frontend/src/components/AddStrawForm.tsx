import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddStraw } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { QualityGrade } from '../backend';

interface AddStrawFormProps {
  onSuccess: () => void;
}

export default function AddStrawForm({ onSuccess }: AddStrawFormProps) {
  const [strawId, setStrawId] = useState('');
  const [bullId, setBullId] = useState('');
  const [collectionDate, setCollectionDate] = useState('');
  const [quality, setQuality] = useState<QualityGrade>(QualityGrade.Standard);
  const [storageLocation, setStorageLocation] = useState('');
  const [quantity, setQuantity] = useState('1');

  const addStrawMutation = useAddStraw();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!strawId.trim()) {
      toast.error('Straw ID is required');
      return;
    }
    if (!bullId.trim()) {
      toast.error('Bull ID is required');
      return;
    }
    if (!collectionDate.trim()) {
      toast.error('Collection date is required');
      return;
    }
    if (!storageLocation.trim()) {
      toast.error('Storage location is required');
      return;
    }

    const quantityNum = parseInt(quantity, 10);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Quantity must be a positive number');
      return;
    }

    try {
      await addStrawMutation.mutateAsync({
        strawId: strawId.trim(),
        bullId: bullId.trim(),
        collectionDate: collectionDate.trim(),
        quality,
        storageLocation: storageLocation.trim(),
        quantity: BigInt(quantityNum),
      });

      toast.success('Semen straw added successfully');
      
      // Reset form
      setStrawId('');
      setBullId('');
      setCollectionDate('');
      setQuality(QualityGrade.Standard);
      setStorageLocation('');
      setQuantity('1');
      
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add semen straw');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="strawId">
            Straw ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="strawId"
            placeholder="e.g., STR-2026-001"
            value={strawId}
            onChange={(e) => setStrawId(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bullId">
            Bull ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bullId"
            placeholder="e.g., BULL-456"
            value={bullId}
            onChange={(e) => setBullId(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="collectionDate">
            Collection Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="collectionDate"
            type="date"
            value={collectionDate}
            onChange={(e) => setCollectionDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quality">
            Quality Grade <span className="text-destructive">*</span>
          </Label>
          <Select
            value={quality}
            onValueChange={(value) => setQuality(value as QualityGrade)}
          >
            <SelectTrigger id="quality">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={QualityGrade.Superior}>Superior</SelectItem>
              <SelectItem value={QualityGrade.Standard}>Standard</SelectItem>
              <SelectItem value={QualityGrade.Substandard}>Substandard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="storageLocation">
            Storage Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="storageLocation"
            placeholder="e.g., Tank A, Shelf 3"
            value={storageLocation}
            onChange={(e) => setStorageLocation(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">
            Quantity <span className="text-destructive">*</span>
          </Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            step="1"
            placeholder="e.g., 10"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          disabled={addStrawMutation.isPending}
          className="gap-2"
        >
          {addStrawMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Add Straw
        </Button>
      </div>
    </form>
  );
}
