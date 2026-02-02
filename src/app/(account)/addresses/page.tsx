'use client';

import { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Check } from 'lucide-react';
import { Button, Badge, Card, CardContent, Modal } from '@/components/ui';
import type { ShippingAddress } from '@/features/checkout/types';

/**
 * @ai-context Addresses page for managing user shipping addresses.
 */

// Mock addresses - replace with actual API integration
const mockAddresses: ShippingAddress[] = [
  {
    id: 1,
    first_name: 'Juan',
    last_name: 'Pérez',
    street: 'Av. Corrientes',
    number: '1234',
    apartment: '5B',
    city: 'Buenos Aires',
    state: 'CABA',
    postal_code: '1043',
    country: 'Argentina',
    phone: '+54 11 1234-5678',
    is_default: true,
  },
  {
    id: 2,
    first_name: 'Juan',
    last_name: 'Pérez',
    street: 'Calle Falsa',
    number: '123',
    apartment: undefined,
    city: 'Córdoba',
    state: 'Córdoba',
    postal_code: '5000',
    country: 'Argentina',
    phone: '+54 351 123-4567',
    is_default: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleSetDefault = async (addressId: number | undefined) => {
    if (!addressId) return;
    try {
      // TODO: Call API to set default address
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          is_default: addr.id === addressId,
        }))
      );
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleDelete = async (addressId: number | undefined) => {
    if (!addressId) return;
    setDeletingId(addressId);
    try {
      // TODO: Call API to delete address
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (addressId: number | undefined) => {
    if (!addressId) return;
    setEditingAddress(addressId);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  if (addresses.length === 0) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Mis direcciones</h2>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar dirección
          </Button>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes direcciones guardadas
            </h3>
            <p className="text-gray-600 mb-6">
              Agrega una dirección de envío para completar tus compras más rápido
            </p>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar dirección
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mis direcciones</h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar dirección
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <Card
            key={address.id}
            className={address.is_default ? 'border-primary border-2' : ''}
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  {address.is_default && (
                    <Badge variant="success">
                      <Check className="mr-1 h-3 w-3" />
                      Por defecto
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(address.id)}
                    className="text-gray-600 hover:text-primary transition-colors"
                    aria-label="Editar dirección"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={deletingId === address.id || address.is_default}
                    className="text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                    aria-label="Eliminar dirección"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Address Details */}
              <address className="not-italic text-sm text-gray-600 mb-4">
                <p className="font-medium text-gray-900 mb-1">
                  {address.first_name} {address.last_name}
                </p>
                <p>
                  {address.street} {address.number}
                </p>
                {address.apartment && <p>Piso/Depto: {address.apartment}</p>}
                <p>
                  {address.city}, {address.state}
                </p>
                <p>CP: {address.postal_code}</p>
                <p>{address.country}</p>
                <p className="mt-2">{address.phone}</p>
              </address>

              {/* Set as Default Button */}
              {!address.is_default && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleSetDefault(address.id)}
                >
                  Establecer como predeterminada
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAddress ? 'Editar dirección' : 'Nueva dirección'}
      >
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Formulario de dirección - TODO: Implementar con ShippingStep component
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={() => setIsModalOpen(false)} className="flex-1">
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
