import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductRowProps {
  product: Product;
  onEdit: (productId: string) => void;
  onDelete?: (productId: string) => void;
}

export function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  return (
    <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground">
              {product.description.substring(0, 30)}...
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-foreground">{product.category}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-lg font-bold text-primary">
          ${product.price.toFixed(2)}
        </span>
      </td>
      <td className="px-6 py-4">
        {product.discount && product.discount > 0 ? (
          <div className="flex flex-col">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 w-fit">
              -{product.discount}%
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              ${(product.price * (1 - product.discount / 100)).toFixed(2)}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">No discount</span>
        )}
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            product.inStock
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product.id)}
            className="rounded-lg gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(product.id)}
              className="text-destructive hover:text-destructive rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
