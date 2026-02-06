'use client';

import { Product } from '@/lib/types';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Configure clean theme
const myTheme = themeQuartz.withParams({
  accentColor: '#3b82f6',
  backgroundColor: '#ffffff',
  foregroundColor: '#1f2937',
  borderColor: '#e5e7eb',
  headerBackgroundColor: '#f9fafb',
  headerTextColor: '#111827',
  rowBorder: true,
  columnBorder: true,
  headerColumnResizeHandleColor: '#d1d5db',
  borderRadius: 8,
  spacing: 12,
  headerFontSize: 14,
  headerFontWeight: 600,
  fontSize: 14,
  cellHorizontalPadding: 16,
  wrapperBorder: true,
  wrapperBorderRadius: 12,
});

interface ProductsTableProps {
  products: Product[];
  onEdit: (productId: string) => void;
  onDelete?: (productId: string) => void;
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  const columnDefs: ColDef<Product>[] = useMemo(() => [
    {
      headerName: 'Product',
      field: 'name',
      flex: 2.5,
      minWidth: 280,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-3 h-full">
          <img
            src={params.data.image || '/products/placeholder.jpg'}
            alt={params.data.name}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
          />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 text-sm truncate">
              {params.data.name}
            </div>
            <div className="text-xs text-gray-500 line-clamp-1">
              {params.data.description}
            </div>
          </div>
        </div>
      ),
      cellStyle: { display: 'flex', alignItems: 'center' } as any,
    },
    {
      headerName: 'Category',
      field: 'category',
      flex: 1.2,
      minWidth: 130,
      cellRenderer: (params: any) => {
        const categoryColors: Record<string, string> = {
          'Dairy': 'bg-blue-100 text-blue-700 border-blue-200',
          'Meat': 'bg-red-100 text-red-700 border-red-200',
          'Vegetables': 'bg-green-100 text-green-700 border-green-200',
          'Fruits': 'bg-orange-100 text-orange-700 border-orange-200',
          'Bakery': 'bg-yellow-100 text-yellow-700 border-yellow-200',
          'Beverages': 'bg-purple-100 text-purple-700 border-purple-200',
        };
        const colors = categoryColors[params.data.category] || 'bg-gray-100 text-gray-700 border-gray-200';
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${colors}`}>
            {params.data.category}
          </span>
        );
      },
    },
    {
      headerName: 'Price',
      field: 'price',
      flex: 1,
      minWidth: 110,
      cellRenderer: (params: any) => {
        const price = Number(params.data.price) || 0;
        const discount = Number(params.data.discount) || 0;
        const hasDiscount = discount > 0;
        const finalPrice = hasDiscount ? price * (1 - discount / 100) : price;
        
        return (
          <div className="flex flex-col gap-0.5">
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {price.toFixed(3)} DT
              </span>
            )}
            <div className="font-semibold text-gray-900">
              {finalPrice.toFixed(3)} DT
            </div>
          </div>
        );
      },
    },
    {
      headerName: 'Discount',
      field: 'discount',
      flex: 1,
      minWidth: 100,
      cellRenderer: (params: any) => {
        const discount = params.data.discount || 0;
        return discount > 0 ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            -{discount}%
          </span>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        );
      },
    },
    {
      headerName: 'Qty',
      field: 'quantity',
      flex: 0.8,
      minWidth: 80,
      cellRenderer: (params: any) => (
        <span className="font-medium text-gray-700">
          {params.data.quantity || 0}
        </span>
      ),
    },
    {
      headerName: 'Status',
      field: 'inStock',
      flex: 1.1,
      minWidth: 130,
      cellRenderer: (params: any) => {
        const inStock = params.data.inStock;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
            inStock
              ? 'bg-green-100 text-green-700 border-green-200'
              : 'bg-red-100 text-red-700 border-red-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        );
      },
    },
    {
      headerName: 'Actions',
      field: 'id',
      flex: 1.3,
      minWidth: 160,
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2 h-full">
          <Button
            onClick={() => onEdit(params.data.id)}
            size="sm"
            className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs"
          >
            <Edit className="w-3.5 h-3.5 mr-1" />
            Edit
          </Button>
          {onDelete && (
            <Button
              onClick={() => onDelete(params.data.id)}
              size="sm"
              className="h-9 px-3 bg-red-600 hover:bg-red-700 text-white font-medium text-xs"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete
            </Button>
          )}
        </div>
      ),
      cellStyle: { display: 'flex', alignItems: 'center', gap: '8px' } as any,
      sortable: false,
      filter: false,
    },
  ] as ColDef<Product>[], [onEdit, onDelete]);

  const defaultColDef: ColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div style={{ height: 600, width: '100%' }}>
        <AgGridReact
          theme={myTheme}
          rowData={products}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          rowHeight={72}
          animateRows={true}
          enableCellTextSelection={true}
        />
      </div>
    </div>
  );
}
