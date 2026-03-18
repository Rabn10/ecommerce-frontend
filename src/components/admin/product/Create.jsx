import React, { useEffect, useState, useRef, useMemo } from 'react'
import Layout from '../../common/Layout'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../../common/Sidebar'
import { set, useForm } from 'react-hook-form'
import { toast } from 'react-toastify';
import { adminToken, apiUrl } from '../../common/http'
import JoditEditor from 'jodit-react';

const Create = ({ placeholder }) => {

    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [disable, setDisable] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const config = useMemo(
        () => ({
            readonly: false, // all options from https://xdsoft.net/jodit/docs/,
            placeholder: placeholder || 'Start typings...'
        }),
        [placeholder]
    );





    const saveProduct = async (data) => {
        setDisable(true);
        console.log(data);
        const res = await fetch(`${apiUrl}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(result => {
                setDisable(false);
                if (result.status === 200) {
                    toast.success(result.message);
                    navigate('/admin/products');
                }
                else {
                    console.log("something went wrong");
                }

            })
    }

    const fetchCategories = async () => {
        const res = await fetch(`${apiUrl}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                setCategories(result.data);
            })
    }

    const fetchBrands = async () => {
        const res = await fetch(`${apiUrl}/brands`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                setBrands(result.data);
            })
    }

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, [])

    return (
        <Layout>

            <div className="container">
                <div className="row">
                    <div className="d-flex justify-content-between mt-5 pb-3">
                        <h4 className='h4 pb-0 mb-0'>Products / Create</h4>
                        <Link to="/admin/products" className='btn btn-primary'>Back</Link>
                    </div>
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-9">
                        <form onSubmit={handleSubmit(saveProduct)}>
                            <div className="card shadow">
                                <div className="card-body p-4">
                                    <div className="mb-3">
                                        <label htmlFor="" className='form-label'>Title</label>
                                        <input
                                            {
                                            ...register("title", {
                                                required: 'The title field is required',
                                            })
                                            }
                                            type="text"
                                            className={`form-control ${errors.title && "is-invalid"}`}
                                            placeholder='Enter  title'
                                        />
                                        {
                                            errors.title &&
                                            <p className="invalid-feedback">{errors.title?.message}</p>
                                        }
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="" className="form-label">Category</label>
                                                <select className="form-control">
                                                    <option value="">Select a category</option>
                                                    {
                                                        categories.map((category) => {
                                                            return (
                                                                <option key={category.id} value={category.id}>{category.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="" className="form-label">Brand</label>
                                                <select className="form-control">
                                                    <option value="">Select a brand</option>
                                                    {
                                                        brands.map((brand) => {
                                                            return (
                                                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">Short Description</label>
                                        <textarea className="form-control" rows={3}></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="" className="form-labe">Description</label>
                                        <JoditEditor
                                            ref={editor}
                                            value={content}
                                            config={config}
                                            tabIndex={1} // tabIndex of textarea
                                            onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                                        />
                                    </div>
                                    <h3 className="py-3 border-bottom mb-3">Pricing</h3>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="" className="form-label">Price</label>
                                                <input type="text" placeholder='Price' className='form-control' />

                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="" className="form-label">Discounted Price</label>
                                                <input type="text" placeholder='Discounted Price' className='form-control' />

                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="py-3 border-bottom mb-3">Inventory</h3>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="" className="form-label">SKU</label>
                                                <input type="text" placeholder='enter SKU' className='form-control' />

                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="" className="form-label">Barcode</label>
                                                <input type="text" placeholder='barcode' className='form-control' />

                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="" className="form-label">Qty</label>
                                                <input type="text" placeholder='enter quantity' className='form-control' />

                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="" className='form-label'>Status</label>
                                                <select
                                                    {
                                                    ...register("status", {
                                                        required: 'please select a status',
                                                    })
                                                    }
                                                    className={`form-control ${errors.status && "is-invalid"}`}>
                                                    <option value="">Select a status</option>
                                                    <option value="1">active</option>
                                                    <option value="0">Inactive</option>
                                                </select>
                                                {
                                                    errors.status &&
                                                    <p className="invalid-feedback">{errors.status?.message}</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="py-3 border-bottom mb-3">Gallery</h3>

                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">Image</label>
                                        <input type="file" className='form-control' />

                                    </div>


                                </div>
                            </div>
                            <button disabled={disable} className='btn btn-primary mt-3 mb-5'>Create</button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Create
