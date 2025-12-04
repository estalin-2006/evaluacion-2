import React, {useEffect, useState} from 'react'
import API from '../api'
import { Link } from 'react-router-dom'

export default function ProductList(){
  const [products, setProducts] = useState([])
  useEffect(()=>{ API.get('/products').then(r=>setProducts(r.data)).catch(()=>{}) },[])
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Catálogo</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map(p=>(
          <div key={p.id} className="border p-2 rounded">
            <img src={p.image_url} alt={p.name} className="h-40 w-full object-cover" />
            <h2 className="font-bold">{p.name}</h2>
            <p>{p.description}</p>
            <p>Precio: {p.price}</p>
            <Link to={'/product/'+p.id} className="text-blue-600">Ver detalle</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
