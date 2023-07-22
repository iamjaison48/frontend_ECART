import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //to hold cart count

  cartitemcount=new BehaviorSubject(0)
//to hold search
  searchTerm= new BehaviorSubject('')

  constructor(private http:HttpClient) { 
    this.cartCount()
  }

  BASE_URL = 'https://backend-for-ecart-o4d6.onrender.com'
  //get all products from mongodb

  getAllProducts(){
    return this.http.get(`${this.BASE_URL}/products/allProducts`)
  }

  //viw part prod from mongodb
  viewproducts(id:any){
    return this.http.get(`${this.BASE_URL}/products/viewProducts/${id}`)
  }

  //wishlist api call
  addtowishlist(id:any,title:any,price:any,image:any){
    const body={
      id,
      title,
      price,
      image
    }
    return this.http.post(`${this.BASE_URL}/products/addtowishlist`,body)
  }
//get all pro from wishlist

getwishlist(){
  return this.http.get(`${this.BASE_URL}/products/getwishlist`)
}

//delete wish
deletewishlist(id:any){
  return this.http.delete(`${this.BASE_URL}/products/deletewishlist/${id}`)
}


//add to cart

addtocart(product:any){
  const body={
    id:product.id,
    title:product.title,
    price:product.price,
    image:product.image,
    quantity:product.quantity
  }

  return this.http.post(`${this.BASE_URL}/products/addtocart`,body)
}
//get cart
getcart(){
  return this.http.get(`${this.BASE_URL}/products/getcart`)
}

//cart count
cartCount(){
  this.getcart().subscribe((result:any)=>{
this.cartitemcount.next(result.length);   
  })
}
//delete cart items 

deleteCart(id:any){
  return this.http.delete(`${this.BASE_URL}/products/deletecart/${id}`)
}

//increment cart count

incrementCartCount(id:any){
return this.http.get(`${this.BASE_URL}/products/increment/${id}`)
}
//decrement
decrementCartCount(id:any){
  return this.http.get(`${this.BASE_URL}/products/decrement/${id}`)
  }
}




