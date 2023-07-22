import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  showPaypalStatus:boolean=false
  
showSuccess:boolean=false

  public payPalConfig?: IPayPalConfig;

  discountClicks:boolean=false
  offerClicked:boolean=false
  paymentStatus:boolean=false;

  username:string=''
  houseno:string=''
  street:string=''
  state: string=''
  phoneno:string=''

totalprice=0

  allcart:any=[]
  cartcounts:any=[]
  constructor(private api:ApiService, private checkOutFb:FormBuilder){}

  addressForm = this.checkOutFb.group({
    name: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    houseNumber: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
    street: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
    state: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    number: ['', [Validators.required, Validators.pattern('[0-9]*')]],
  })
  
ngOnInit(): void {
  this.api.cartitemcount.subscribe((data:any)=>{
    console.log(data);
    this.cartcounts=data

    this.initConfig();

    
  })
  this.api.getcart().subscribe((result:any)=>{
    console.log(result);
    this.allcart=result
    this.api.cartCount()
    this.getcartTotal()

    // alert(result)
    
  },
  (result:any)=>{
    console.log(result.error);
    
  })
}

removecart(id:any){
  this.api.deleteCart(id).subscribe((result:any)=>{
    this.allcart=result 
    this.api.cartCount()
  },
  (result:any)=>{
alert(result.error)
  }
 ) }

 //get cart total

 getcartTotal(){
  let total = 0
  this.allcart.forEach((result:any)=>{
    total+=result.grandTotal
    this.totalprice=Math.ceil(total)
  })
 }

 //incrementCart
 incrementCart(id:any){
  this.api.incrementCartCount(id).subscribe((result:any)=>{
    this.allcart=result
    this.getcartTotal()

  },
  (result:any)=>{
    alert(result.error);
    
  })

 }

 
 //decrementCart
 decrementCart(id:any){
  this.api.decrementCartCount(id).subscribe((result:any)=>{
    this.allcart=result
    this.getcartTotal()

  },
  (result:any)=>{
    alert(result.error);
    
  })

 }

 submitPay(){
  if(this.addressForm.valid){
 this.username=this.addressForm.value.name||'';
 this.houseno=this.addressForm.value.houseNumber||'';
 this.street=this.addressForm.value.street||'';
 this.state=this.addressForm.value.state||'';
 this.phoneno=this.addressForm.value.number||'';

this.paymentStatus=true
  }
  else{
    alert("invalid Form")
  }
 }
 offersClick(){
  this.offerClicked=true
  this.discountClicks=true
 }
 discount(value:any){
  this.totalprice=this.totalprice*(100-value)/100
  this.offerClicked=false
 }

 //payment

 

 private initConfig(): void {
  this.payPalConfig = {
  currency: 'EUR',
  clientId: 'sb',
  createOrderOnClient: (data) => <ICreateOrderRequest>{
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'EUR',
          value: '9.99',
          breakdown: {
            item_total: {
              currency_code: 'EUR',
              value: '9.99'
            }
          }
        },
        items: [
          {
            name: 'Enterprise Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: '9.99',
            },
          }
        ]
      }
    ]
  },
  advanced: {
    commit: 'true'
  },
  style: {
    label: 'paypal',
    layout: 'vertical'
  },
  onApprove: (data, actions) => {
    console.log('onApprove - transaction was approved, but not authorized', data, actions);
    actions.order.get().then((details:any) => {
      console.log('onApprove - you can get full order details inside onApprove: ', details);
    });
  },
  onClientAuthorization: (data) => {
    console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
    this.showSuccess = true;
  },
  onCancel: (data, actions) => {
    console.log('OnCancel', data, actions);
  },
  onError: err => {
    console.log('OnError', err);
  },
  onClick: (data, actions) => {
    console.log('onClick', data, actions);
  },
};
}


paypalPay(){
  this.showPaypalStatus=true
}

modalClose(){
  this.addressForm.reset()
  this.showPaypalStatus=false
  this.showSuccess=false
  this.paymentStatus=false
}
}

