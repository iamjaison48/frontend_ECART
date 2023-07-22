import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit {
productId:any


product:any={}
constructor(private viewActivatedRoute:ActivatedRoute,private api:ApiService){}

ngOnInit(): void {
  this.viewActivatedRoute.params.subscribe((data:any)=>{
    console.log(data);
    console.log(data.id);
this.productId=data.id;
    //view part pro det

    this.api.viewproducts(this.productId).subscribe((result:any)=>{
      console.log(result); //arr of prod
      this.product=result
    })
    
  })
}
//add to wishlist

addtowishlist(){
  const {id,title,price,image} = this.product
  //api call

this.api.addtowishlist(id,title,price,image).subscribe((result:any)=>{
  alert(result);

  },
  (result:any)=>{
    alert(result.error);
   } )
  }
  //addto cart

addtocart(product:any){
  //add quantity 1 to product object

  Object.assign(product,{quantity:1})
  console.log(product);
  this.api.addtocart(product).subscribe((result:any)=>{
    this.api.cartCount()

    alert(result)
  },
  (result:any)=>{
    alert(result.error)
  })
}

}

