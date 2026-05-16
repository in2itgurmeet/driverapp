import { Injectable, signal } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class DefultUsageService {
  greeting: string;
  bookingMode = signal<'FTL' | 'PTL'>(
    (localStorage.getItem('bookingMode') as 'FTL' | 'PTL') || 'FTL'
  );
  orderData: any = {};
   isLoggedIn = signal(!!localStorage.getItem('token'));

  constructor(    private toastController: ToastController
) {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour < 12) {
      this.greeting = 'Good morning';
    } else if (currentHour < 18) {
      this.greeting = 'Good afternoon';
    } else if (currentHour < 21) {
      this.greeting = 'Good evening';
    } else {
      this.greeting = 'Good night';
    }
  }

vehicles = [
  {
    name: 'Mahindra Jeeto',
    capacity: '700 kg',
    dimensions: '7 FT X 4.6 FT X 5 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: 'Tata Ace',
    capacity: '780 kg',
    dimensions: '7 FT X 4.9 FT X 5.5 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: 'Ashok Leyland Dost',
    capacity: '1500 kg',
    dimensions: '8.7 FT X 5.3 FT X 6 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: 'Mahindra Supro Maxitruck',
    capacity: '1050 kg',
    dimensions: '8.2 FT X 5 FT X 5.8 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: 'Piaggio Ape Xtra LDX',
    capacity: '500 kg',
    dimensions: '6 FT X 4.5 FT X 5 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: 'Bolero Pickup',
    capacity: '1700 kg',
    dimensions: '8.7 FT X 5.6 FT X 6 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: 'Tata Intra V30',
    capacity: '1300 kg',
    dimensions: '8.8 FT X 5.3 FT X 6 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: 'Tata 407',
    capacity: '2500 kg',
    dimensions: '10 FT X 6 FT X 7 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: 'Eicher Pro 2049',
    capacity: '3500 kg',
    dimensions: '14 FT X 7 FT X 7 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: '14FT Truck',
    capacity: '4000 kg',
    dimensions: '14 FT X 7 FT X 7 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: '17FT Truck',
    capacity: '5000 kg',
    dimensions: '17 FT X 7 FT X 7 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: '20FT Eicher',
    capacity: '6000 kg',
    dimensions: '20 FT X 7.5 FT X 7 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: '22FT Truck',
    capacity: '7000 kg',
    dimensions: '22 FT X 7.5 FT X 7 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: '24FT Truck',
    capacity: '9000 kg',
    dimensions: '24 FT X 7.5 FT X 8 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: '32FT Multi Axle',
    capacity: '14000 kg',
    dimensions: '32 FT X 8 FT X 8 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: '40FT Trailer',
    capacity: '25000 kg',
    dimensions: '40 FT X 8 FT X 8.5 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: 'Container 20FT',
    capacity: '7000 kg',
    dimensions: '20 FT X 8 FT X 8 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: 'Container 32FT',
    capacity: '15000 kg',
    dimensions: '32 FT X 8 FT X 8.5 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: 'Container 40FT',
    capacity: '25000 kg',
    dimensions: '40 FT X 8 FT X 8.5 FT',
    img: '../../../assets/icon/Select_vichle.png'
  },
  {
    name: 'Mini Tempo',
    capacity: '1000 kg',
    dimensions: '8 FT X 5 FT X 6 FT',
    img: '../../../assets/icon/Select_vichle.png'
  }
];

   orders:any = [
    {
      "id": 1,
      "orderId": "ORD1242342350",
      "tripNo": "LR/1220324324553",
      "status": "Cancelled",
      "bookingType": "FTL",
      "pickup": {
        "location": "New Delhi Sarita Vihar",
        "person": "Austin Thurstan",
        "phone": "9999999999"
      },
      "delivery": {
        "location": "Gurgaon Sector 21",
        "person": "Rahul Mehra",
        "phone": "8888888888"
      },
      "weight": "500kg",
      "quantity": 25,
      "vehicle": "20FT Eicher",
      "capacity": "850 Kg",
      "amount": "4720.00",
      "paymentType": "Prepaid"
    },
    {
      "id": 2,
      "orderId": "ORD1242342351",
      "tripNo": "LR/1220324324554",
      "status": "Booked",
      "bookingType": "PTL",
      "pickup": {
        "location": "Noida Sector 62",
        "person": "Ravi Kumar",
        "phone": "7777777777"
      },
      "delivery": {
        "location": "Delhi Rohini",
        "person": "Amit Sharma",
        "phone": "9998887776"
      },
      "weight": "300kg",
      "quantity": 10,
      "vehicle": "Tata 407",
      "capacity": "500 Kg",
      "amount": "3200.00",
      "paymentType": "To Pay"
    },
    {
      "id": 3,
      "orderId": "ORD1242342352",
      "tripNo": "LR/1220324324555",
      "status": "In-Transit",
      "bookingType": "FTL",
      "pickup": {
        "location": "Faridabad",
        "person": "Vikas Singh",
        "phone": "9123456789"
      },
      "delivery": {
        "location": "Jaipur",
        "person": "Mohit Jain",
        "phone": "9988776655"
      },
      "weight": "800kg",
      "quantity": 40,
      "vehicle": "32FT Truck",
      "capacity": "2000 Kg",
      "amount": "9200.00",
      "paymentType": "Prepaid"
    },
    {
      "id": 4,
      "orderId": "ORD1242342353",
      "tripNo": "LR/1220324324556",
      "status": "Delivered",
      "bookingType": "PTL",
      "pickup": {
        "location": "Delhi",
        "person": "Sandeep",
        "phone": "9876543210"
      },
      "delivery": {
        "location": "Lucknow",
        "person": "Ankit",
        "phone": "9871234560"
      },
      "weight": "200kg",
      "quantity": 5,
      "vehicle": "Mini Truck",
      "capacity": "300 Kg",
      "amount": "2100.00",
      "paymentType": "Prepaid"
    },
    {
      "id": 5,
      "orderId": "ORD1242342354",
      "tripNo": "LR/1220324324557",
      "status": "Cancelled",
      "bookingType": "FTL",
      "pickup": {
        "location": "Ghaziabad",
        "person": "Deepak",
        "phone": "9012345678"
      },
      "delivery": {
        "location": "Agra",
        "person": "Manoj",
        "phone": "9023456789"
      },
      "weight": "600kg",
      "quantity": 30,
      "vehicle": "Truck",
      "capacity": "1500 Kg",
      "amount": "6500.00",
      "paymentType": "To Pay"
    },
    {
      "id": 6,
      "orderId": "ORD1242342355",
      "tripNo": "LR/1220324324558",
      "status": "Pending",
      "bookingType": "PTL",
      "pickup": {
        "location": "Chandigarh",
        "person": "Rohit",
        "phone": "9898989898"
      },
      "delivery": {
        "location": "Amritsar",
        "person": "Karan",
        "phone": "9797979797"
      },
      "weight": "150kg",
      "quantity": 8,
      "vehicle": "Pickup",
      "capacity": "300 Kg",
      "amount": "1800.00",
      "paymentType": "Prepaid"
    },
    {
      "id": 7,
      "orderId": "ORD1242342356",
      "tripNo": "LR/1220324324559",
      "status": "Booked",
      "bookingType": "FTL",
      "pickup": {
        "location": "Delhi",
        "person": "Sunil",
        "phone": "9090909090"
      },
      "delivery": {
        "location": "Mumbai",
        "person": "Ajay",
        "phone": "9191919191"
      },
      "weight": "1000kg",
      "quantity": 50,
      "vehicle": "Container",
      "capacity": "5000 Kg",
      "amount": "15000.00",
      "paymentType": "Prepaid"
    },
    {
      "id": 8,
      "orderId": "ORD1242342357",
      "tripNo": "LR/1220324324560",
      "status": "In-Transit",
      "bookingType": "PTL",
      "pickup": {
        "location": "Pune",
        "person": "Ramesh",
        "phone": "8887776665"
      },
      "delivery": {
        "location": "Nagpur",
        "person": "Suresh",
        "phone": "7776665554"
      },
      "weight": "400kg",
      "quantity": 20,
      "vehicle": "Tata Ace",
      "capacity": "700 Kg",
      "amount": "3500.00",
      "paymentType": "To Pay"
    },
    {
      "id": 9,
      "orderId": "ORD1242342358",
      "tripNo": "LR/1220324324561",
      "status": "Delivered",
      "bookingType": "FTL",
      "pickup": {
        "location": "Hyderabad",
        "person": "Nikhil",
        "phone": "9988001122"
      },
      "delivery": {
        "location": "Bangalore",
        "person": "Varun",
        "phone": "8877001122"
      },
      "weight": "900kg",
      "quantity": 35,
      "vehicle": "Truck",
      "capacity": "2500 Kg",
      "amount": "11000.00",
      "paymentType": "Prepaid"
    },
    {
      "id": 10,
      "orderId": "ORD1242342359",
      "tripNo": "LR/1220324324562",
      "status": "Cancelled",
      "bookingType": "PTL",
      "pickup": {
        "location": "Indore",
        "person": "Arjun",
        "phone": "9000112233"
      },
      "delivery": {
        "location": "Bhopal",
        "person": "Kunal",
        "phone": "9111223344"
      },
      "weight": "250kg",
      "quantity": 12,
      "vehicle": "Mini Truck",
      "capacity": "500 Kg",
      "amount": "2700.00",
      "paymentType": "To Pay"
    },
    {
      "orderId": "ORD1242342360",
      "tripNo": "LR/60001",
      "status": "Pending",
      "bookingType": "FTL",
      "pickup": {
        "location": "Delhi Sarita Vihar Phase 1",
        "person": "Rahul Sharma",
        "phone": "9876543210"
      },
      "delivery": {
        "location": "Noida Sector 62",
        "person": "Amit Verma",
        "phone": "9123456780"
      },
      "weight": "500kg",
      "quantity": 25,
      "vehicle": "20FT Eicher",
      "amount": "4720",
      "paymentType": "Prepaid"
    },
    {
      "orderId": "ORD1242342361",
      "tripNo": "LR/60002",
      "status": "Booked",
      "bookingType": "PTL",
      "pickup": {
        "location": "Gurgaon Cyber City",
        "person": "Sandeep Kumar",
        "phone": "9988776655"
      },
      "delivery": {
        "location": "Jaipur MI Road",
        "person": "Ravi Singh",
        "phone": "8877665544"
      },
      "weight": "300kg",
      "quantity": 15,
      "vehicle": "14FT Truck",
      "amount": "3500",
      "paymentType": "COD"
    },
    {
      "orderId": "ORD1242342362",
      "tripNo": "LR/60003",
      "status": "In-Transit",
      "bookingType": "FTL",
      "pickup": {
        "location": "Faridabad Industrial Area",
        "person": "Manoj Yadav",
        "phone": "9090909090"
      },
      "delivery": {
        "location": "Lucknow Hazratganj",
        "person": "Anil Mishra",
        "phone": "8080808080"
      },
      "weight": "700kg",
      "quantity": 40,
      "vehicle": "32FT Container",
      "amount": "8200",
      "paymentType": "Prepaid"
    },
    {
      "orderId": "ORD1242342363",
      "tripNo": "LR/60004",
      "status": "Delivered",
      "bookingType": "PTL",
      "pickup": {
        "location": "Chandigarh Sector 17",
        "person": "Vikas Sharma",
        "phone": "9898989898"
      },
      "delivery": {
        "location": "Amritsar Golden Temple Road",
        "person": "Harpreet Singh",
        "phone": "7878787878"
      },
      "weight": "200kg",
      "quantity": 10,
      "vehicle": "Pickup",
      "amount": "2000",
      "paymentType": "COD"
    },
    {
      "orderId": "ORD1242342363",
      "tripNo": "LR/60005",
      "status": "Cancelled",
      "bookingType": "FTL",
      "pickup": {
        "location": "Mumbai Andheri East",
        "person": "Rohit Mehta",
        "phone": "9000000001"
      },
      "delivery": {
        "location": "Pune Hinjewadi Phase 2",
        "person": "Sneha Joshi",
        "phone": "9000000002"
      },
      "weight": "600kg",
      "quantity": 30,
      "vehicle": "22FT Truck",
      "amount": "6000",
      "paymentType": "Prepaid"
    },
    {
      "orderId": "ORD1242342373",
      "tripNo": "LR/60006",
      "status": "Pending",
      "bookingType": "PTL",
      "pickup": {
        "location": "Hyderabad Banjara Hills",
        "person": "Kiran Reddy",
        "phone": "9012345678"
      },
      "delivery": {
        "location": "Bangalore Whitefield",
        "person": "Arjun Rao",
        "phone": "9023456789"
      },
      "weight": "450kg",
      "quantity": 20,
      "vehicle": "Mini Truck",
      "amount": "4200",
      "paymentType": "COD"
    },
    {
      "orderId": "ORD1242342378",
      "tripNo": "LR/60007",
      "status": "Booked",
      "bookingType": "FTL",
      "pickup": {
        "location": "Ahmedabad SG Highway",
        "person": "Jignesh Patel",
        "phone": "9034567890"
      },
      "delivery": {
        "location": "Surat Textile Market",
        "person": "Mehul Shah",
        "phone": "9045678901"
      },
      "weight": "800kg",
      "quantity": 50,
      "vehicle": "32FT Container",
      "amount": "9000",
      "paymentType": "Prepaid"
    },
    {
      "orderId": "ORD1242342387",
      "tripNo": "LR/60008",
      "status": "In-Transit",
      "bookingType": "PTL",
      "pickup": {
        "location": "Kolkata Salt Lake",
        "person": "Sourav Das",
        "phone": "9056789012"
      },
      "delivery": {
        "location": "Patna Boring Road",
        "person": "Rakesh Kumar",
        "phone": "9067890123"
      },
      "weight": "350kg",
      "quantity": 18,
      "vehicle": "14FT Truck",
      "amount": "3800",
      "paymentType": "COD"
    },
    {
      "orderId": "ORD1242342892",
      "tripNo": "LR/60009",
      "status": "Delivered",
      "bookingType": "FTL",
      "pickup": {
        "location": "Indore Vijay Nagar",
        "person": "Deepak Jain",
        "phone": "9078901234"
      },
      "delivery": {
        "location": "Bhopal MP Nagar",
        "person": "Amit Tiwari",
        "phone": "9089012345"
      },
      "weight": "550kg",
      "quantity": 28,
      "vehicle": "20FT Truck",
      "amount": "5100",
      "paymentType": "Prepaid"
    },
    {
      "orderId": "ORD1242342342",
      "tripNo": "LR/60010",
      "status": "Cancelled",
      "bookingType": "PTL",
      "pickup": {
        "location": "Nagpur Sitabuldi",
        "person": "Vivek Sharma",
        "phone": "9090123456"
      },
      "delivery": {
        "location": "Raipur GE Road",
        "person": "Pooja Verma",
        "phone": "9101234567"
      },
      "weight": "250kg",
      "quantity": 12,
      "vehicle": "Pickup",
      "amount": "2700",
      "paymentType": "COD"
    }
  ]



    async successToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle'
    });

    await toast.present();
  }

  async errorToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'top',
      color: 'danger',
      icon: 'close-circle'
    });

    await toast.present();
  }





  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
  }

  login(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedIn.set(true);
  }
}
