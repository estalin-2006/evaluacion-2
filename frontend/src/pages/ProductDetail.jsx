import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import API from '../api'

export default function ProductDetail(){
  const {id} = useParams()
  const [product, setProduct] = useState(null)
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  useEffect(()=>{ API.get('/products/'+id).then(r=>setProduct(r.data)); API.get('/comments/'+id).then(r=>setComments(r.data)) },[id])
  const sendComment = async ()=>{
    try{
      await API.post('/comments',{ product_id:id, content:text })
      setComments(prev=>[...prev,{content:text, user:{name:'You'}}])
      setText('')
    }catch(e){ alert('Necesitas autenticarte o configurar CORS/token') }
  }
  if(!product) return <div>Cargando...</div>
  return (
    <div className="p-6">
      <img src={product.image_url} alt="" className="w-96 h-96 object-cover" />
      <h1 className="text-2xl">{product.name}</h1>
      <p>{product.description}</p>
      <p>Precio: {product.price}</p>

      <div className="mt-6">
        <h2 className="font-bold">Comentarios</h2>
        <div>
          {comments.map((c,i)=>(<div key={i}><b>{c.user?.name || 'Anon'}</b>: {c.content}</div>))}
        </div>
        <div className="mt-2">
          <textarea maxLength={200} value={text} onChange={e=>setText(e.target.value)} className="border p-2 w-full" />
          <button onClick={sendComment} className="mt-2 p-2 bg-blue-600 text-white rounded">Enviar comentario</button>
        </div>
      </div>
    </div>
  )
}
