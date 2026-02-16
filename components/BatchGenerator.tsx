import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export const BatchGenerator: React.FC = () => {
  const [products, setProducts] = useState(['']);
  
  const addProduct = () => setProducts([...products, '']);
  const updateProduct = (idx: number, val: string) => {
      const newP = [...products];
      newP[idx] = val;
      setProducts(newP);
  };

  return (
    <Card title="Batch Campaign Generator" className="border-brand-500/20">
       <div className="bg-brand-900/10 p-3 rounded mb-4 border border-brand-500/10">
           <p className="text-xs text-brand-400">Agency Mode: Generate concepts for multiple products simultaneously.</p>
       </div>
       
       <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
           {products.map((p, i) => (
               <div key={i} className="flex gap-2">
                   <div className="bg-slate-800 px-3 py-2 rounded text-slate-500 text-xs font-mono">{i + 1}</div>
                   <Input 
                     placeholder={`Product Name #${i+1}`} 
                     value={p} 
                     onChange={(e) => updateProduct(i, e.target.value)} 
                   />
               </div>
           ))}
       </div>
       
       <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700/50">
           <Button variant="secondary" onClick={addProduct} size="sm">+ Add Row</Button>
           <Button className="flex-1">Generate {products.length} Campaigns</Button>
       </div>
    </Card>
  );
};