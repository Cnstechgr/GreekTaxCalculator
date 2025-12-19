'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Loader2 } from 'lucide-react';

export function NewBusinessForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    businessName: '',
    activity: '',
    address: '',
    taxId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Σφάλμα κατά τη δημιουργία');
        setIsLoading(false);
        return;
      }

      router.push(`/business/${data.business.id}`);
    } catch (error) {
      setError('Σφάλμα κατά τη δημιουργία της επιχείρησης');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="businessName">Επωνυμία *</Label>
        <Input
          id="businessName"
          name="businessName"
          type="text"
          placeholder="π.χ. ΛΙΧΑΣ ΠΑΝΑΓΙΩΤΗΣ"
          value={formData.businessName}
          onChange={handleChange}
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="activity">Δραστηριότητα *</Label>
        <Input
          id="activity"
          name="activity"
          type="text"
          placeholder="π.χ. ΕΜΠΟΡΙΟ Η/Υ"
          value={formData.activity}
          onChange={handleChange}
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Διεύθυνση *</Label>
        <Input
          id="address"
          name="address"
          type="text"
          placeholder="π.χ. ΑΝΔΡΙΤΣΑΙΝΗΣ 15 ΠΕΡΙΣΤΕΡΙ"
          value={formData.address}
          onChange={handleChange}
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="taxId">ΑΦΜ (9 ψηφία) *</Label>
        <Input
          id="taxId"
          name="taxId"
          type="text"
          placeholder="123456789"
          value={formData.taxId}
          onChange={handleChange}
          required
          pattern="[0-9]{9}"
          maxLength={9}
          className="h-11"
        />
        <p className="text-xs text-gray-500">
          Εισάγετε τον 9ψήφιο Αριθμό Φορολογικού Μητρώου
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Ακύρωση
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Αποθήκευση...
            </>
          ) : (
            <>
              <Building2 className="mr-2 h-4 w-4" />
              Δημιουργία
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
