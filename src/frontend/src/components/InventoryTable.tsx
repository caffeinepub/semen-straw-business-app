import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Package, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditStrawForm from './EditStrawForm';
import SaleDialog from './SaleDialog';
import type { SemenStraw } from '../backend';
import { Card, CardContent } from '@/components/ui/card';

interface InventoryTableProps {
  straws: SemenStraw[];
}

export default function InventoryTable({ straws }: InventoryTableProps) {
  const [selectedStraw, setSelectedStraw] = useState<SemenStraw | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);

  const handleEdit = (straw: SemenStraw) => {
    setSelectedStraw(straw);
    setIsEditDialogOpen(true);
  };

  const handleSell = (straw: SemenStraw) => {
    setSelectedStraw(straw);
    setIsSaleDialogOpen(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Available':
        return 'default';
      case 'Sold':
        return 'secondary';
      case 'Used':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getQualityVariant = (quality: string) => {
    switch (quality) {
      case 'Superior':
        return 'default';
      case 'Standard':
        return 'secondary';
      case 'Substandard':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (straws.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Package className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Straws Found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            No semen straws match your current filters. Try adjusting your search or add a new straw to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Straw ID</TableHead>
              <TableHead className="font-semibold">Bull ID</TableHead>
              <TableHead className="font-semibold">Collection Date</TableHead>
              <TableHead className="font-semibold">Quality Grade</TableHead>
              <TableHead className="font-semibold">Storage Location</TableHead>
              <TableHead className="font-semibold">Quantity</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {straws.map((straw) => (
              <TableRow key={straw.strawId} className="hover:bg-muted/30">
                <TableCell className="font-medium">{straw.strawId}</TableCell>
                <TableCell>{straw.bullId}</TableCell>
                <TableCell>{straw.collectionDate}</TableCell>
                <TableCell>
                  <Badge variant={getQualityVariant(straw.quality)}>
                    {straw.quality}
                  </Badge>
                </TableCell>
                <TableCell>{straw.storageLocation}</TableCell>
                <TableCell className="font-medium">{straw.quantity.toString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(straw.status)}>
                    {straw.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSell(straw)}
                      className="gap-2"
                      disabled={straw.quantity === 0n || straw.status !== 'Available'}
                    >
                      <DollarSign className="w-4 h-4" />
                      Sell
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(straw)}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Semen Straw</DialogTitle>
          </DialogHeader>
          {selectedStraw && (
            <EditStrawForm
              straw={selectedStraw}
              onSuccess={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isSaleDialogOpen} onOpenChange={setIsSaleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Sale</DialogTitle>
          </DialogHeader>
          {selectedStraw && (
            <SaleDialog
              straw={selectedStraw}
              onSuccess={() => setIsSaleDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
