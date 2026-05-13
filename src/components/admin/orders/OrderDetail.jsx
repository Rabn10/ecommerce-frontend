import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import { Link, useParams } from 'react-router-dom'
import Sidebar from '../../common/Sidebar'
import { adminToken, apiUrl } from '../../common/http'
import Loader from '../../common/Loader'

const OrderDetail = () => {
    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]);
    const [loader, setLoader] = useState(false);

    const params = useParams();

    const fetchOrders = async () => {
        setLoader(true);
        const res = await fetch(`${apiUrl}/orders/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                setLoader(false);
                if (result.status === 200) {
                    setOrders(result.data);
                    setItems(result.data.items);

                }
                else {
                    console.log("something went wrong");
                }

            })
    }

    useEffect(() => {
        fetchOrders();
    }, [])

  return (
    <Layout>

            <div className="container">
                <div className="row">
                    <div className="d-flex justify-content-between mt-5 pb-3">
                        <h4 className='h4 pb-0 mb-0'>Your title</h4>
                        <Link to="/admin/orders" className='btn btn-primary'>Back</Link>
                    </div>
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-9">
                        <div className="row">
                            <div className="col-md-9">
                                <div className="card shadow mb-5">
                                    <div className="card-body p-4">
                                        {
                                            loader == true && < Loader/>
                                        }

                                        {
                                            loader == false &&
                                            <div>
                                                <div className='row'>
                                                    <div className="col-md-4">
                                                        <h3>Order ID: #{orders.id}</h3>
                                                        {
                                                            orders.status == 'pending' && <span className='badge bg-warning'>Pending</span>
                                                        }
                                                        {
                                                            orders.status == 'shipped' && <span className='badge bg-warning'>shipped</span>
                                                        }
                                                        {
                                                            orders.status == 'delivered' && <span className='badge bg-success'>delivered</span>
                                                        }
                                                        {
                                                            orders.status == 'cancelled' && <span className='badge bg-danger'>cancelled</span>
                                                        }
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="text-secondary">Date</div>
                                                        <h4 className='pt-2'>{orders.created_at}</h4>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="text-secondary">Payment Status</div>
                                                        {
                                                            orders.payment_status === 'paid' ? (
                                                            <span className='badge bg-success'>{orders.payment_status}</span>
                                                            ) : (
                                                            <span className='badge bg-danger'>{orders.payment_status}</span>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <div className='py-5'>
                                                                <strong>{orders.name}</strong>
                                                                <div>{orders.email}</div>
                                                                <div>{orders.mobile}</div>
                                                                <div>{orders.address}, {orders.city} {orders.state} {orders.zip}</div>
                                                            </div>

                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="text-secondary pt-5">Payment Status</div>
                                                            <p>COD</p>
                                                        </div>
                                                    </div>
                                                    <div class="row pt-5">
                                                        <h3 class="pb-2 "><strong>Items</strong></h3>
                                                        {
                                                            items.map((item) => {
                                                                return(
                                                                    <div class="row justify-content-end">
                                                                        <div class="col-lg-12">
                                                                            <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                                                                                <div class="d-flex">
                                                                                    {
                                                                                        item.product.image && <img
                                                                                        width="70" className="me-3" src={`${item.product.image_url}`} alt=""
                                                                                        />
                                                                                    }
                                                                                    
                                                                                        <div class="d-flex flex-column">
                                                                                            <div class="mb-2"><span>{item.name}</span></div>
                                                                                            <div><button class="btn btn-size">{item.size}</button></div>
                                                                                        </div>
                                                                                </div>
                                                                                <div class="d-flex">
                                                                                <div>X {item.qty}</div>
                                                                                <div class="ps-3">${item.price}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        
                                                        <div class="row justify-content-end">
                                                            <div class="col-lg-12">
                                                                <div class="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                                    <div>Subtotal</div>
                                                                    <div>${orders.subtotal}</div>
                                                                </div>
                                                                <div class="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                                    <div>Shipping</div>
                                                                    <div>${orders.shipping}</div>
                                                                </div>
                                                                <div class="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                                    <div><strong>Grand Total</strong></div>
                                                                    <div>${orders.grand_total}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card shadow">
                                    <div className="card-body p-4">

                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </Layout>
  )
}

export default OrderDetail
