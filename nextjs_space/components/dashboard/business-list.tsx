'use client';

import { useState } from 'react';
import { Building2, Calendar, FileText, ArrowRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'react-hot-toast';

interface Business {
  id: string;
  businessName: string;
  activity: string;
  address: string;
  taxId: string;
  updatedAt: Date;
  individualCalculations?: Array<{ year: number }>;
}

export function BusinessList({ businesses }: { businesses: Business[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (businessId: string) => {
    setDeletingId(businessId);
    try {
      const response = await fetch(`/api/business/${businessId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Η επιχείρηση διαγράφηκε επιτυχώς');
        router.refresh();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Σφάλμα κατά τη διαγραφή');
      }
    } catch (error) {
      toast.error('Σφάλμα κατά τη διαγραφή της επιχείρησης');
    } finally {
      setDeletingId(null);
    }
  };

  if (businesses.length === 0) {
    return (
      <div className="bg-card rounded-2xl shadow-sm border border-border p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-full">
            <Building2 className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Δεν υπάρχουν επιχειρήσεις
        </h3>
        <p className="text-muted-foreground mb-6">
          Προσθέστε την πρώτη σας επιχείρηση για να ξεκινήσετε
        </p>
        <Link href="/business/new">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Building2 className="mr-2 h-5 w-5" />
            Προσθήκη Επιχείρησης
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <div
          key={business.id}
          className="bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                ΑΦΜ: {business.taxId}
              </span>
            </div>

            <h3 className="text-lg font-semibold mb-1">
              {business.businessName}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{business.activity}</p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Calendar className="h-3 w-3" />
              Τελευταία ενημέρωση:{' '}
              {new Date(business.updatedAt).toLocaleDateString('el-GR')}
            </div>

            {business.individualCalculations && business.individualCalculations.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-3 py-2 rounded-lg mb-4">
                <FileText className="h-3 w-3" />
                Υπολογισμοί: {business.individualCalculations[0].year}
              </div>
            )}

            <div className="flex gap-2">
              <Link href={`/business/${business.id}`} className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Άνοιγμα
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={deletingId === business.id}
                    className="border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Διαγραφή επιχείρησης</AlertDialogTitle>
                    <AlertDialogDescription>
                      Είστε σίγουροι ότι θέλετε να διαγράψετε την επιχείρηση &quot;{business.businessName}&quot;; 
                      Αυτή η ενέργεια δεν μπορεί να αναιρεθεί και θα διαγραφούν όλοι οι υπολογισμοί που σχετίζονται με αυτήν.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(business.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Διαγραφή
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
