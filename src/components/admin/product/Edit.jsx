import React, { useEffect, useMemo, useRef, useState } from 'react'
import Layout from '../../common/Layout'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../../common/Sidebar'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import { adminToken, apiUrl } from '../../common/http'

const Edit = ({ placeholder }) => {

    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [disable, setDisable] = useState(false);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [sizesChecked, setSizesChecked] = useState([]);

    const [productImages, setProductImages] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
    const {
        register,
        handleSubmit,
        watch,
        setError,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            const res = await fetch(`${apiUrl}/products/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                }
            })
                .then(res => res.json())
                .then(result => {
                    setProductImages(result.data.product_images);
                    setSizesChecked(result.productSizes);
                    reset({
                        title: result.data.title,
                        category_id: result.data.category_id,
                        brand_id: result.data.brand_id,
                        sku: result.data.sku,
                        price: result.data.price,
                        sale_price: result.data.sale_price,
                        quantity: result.data.quantity,
                        barcode: result.data.barcode,
                        is_featured: result.data.is_featured,
                        status: result.data.status,
                        description: result.data.description,
                        compare_price: result.data.compare_price,
                        short_description: result.data.short_description
                    })
                })
        }
    });

    const config = useMemo(
        () => ({
            readonly: false, // all options from https://xdsoft.net/jodit/docs/,
            placeholder: placeholder || 'Start typings...'
        }),
        [placeholder]
    );


    const saveProduct = async (data) => {

        const formData = { ...data, "description": content };
        setDisable(true);
        const res = await fetch(`${apiUrl}/products/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            },
            body: JSON.stringify(formData)
        }).then(res => res.json())
            .then(result => {
                setDisable(false);
                if (result.status === 200) {
                    toast.success(result.message);
                    navigate('/admin/products');
                }
                else {
                    const formErrors = result.errors;
                    Object.keys(formErrors).forEach((field) => {
                        setError(field, { message: formErrors[field[0]] });
                    })
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
                setBrands(result.data);
            })
    }

    const fetchSizes = async () => {
        const res = await fetch(`${apiUrl}/sizes`, {
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
                setSizes(result.data);
            })
    }

    const handleFile = async (e) => {
        const formData = new FormData();
        const file = e.target.files[0];
        formData.append('image', file);
        formData.append('product_id', params.id);
        setDisable(true);
        const res = await fetch(`${apiUrl}/save-product-image`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            },
            body: formData
        })
            .then(res => res.json())
            .then(result => {

                if (result.status == 200) {
                    productImages.push(result.data);
                    setProductImages(productImages);
                } else {
                    toast.error(result.errors.image[0]);
                }

                setDisable(false);
                e.target.value = "";
            })

    }

    const changeImage = async (image) => {
        const res = await fetch(`${apiUrl}/change-product-default-image?product_id=${params.id}&image=${image}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            }
        })
            .then(res => res.json())
            .then(result => {
                if (res.result == 200) {
                    toast.success(result.message);
                } else {
                    console.log("something went wrong");
                }
            })
    }

    const deleteImage = async (id) => {
        if (confirm('Are you sure you want to delete this image?')) {
            const res = await fetch(`${apiUrl}/delete-product-image/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                }
            })
                .then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        const newProductImages = productImages.filter(productImage => productImage.id !== id);
                        setProductImages(newProductImages);
                        toast.success(result.message);

                    }
                    else {
                        toast.error(result.message);
                    }
                })
        }

    }

    useEffect(() => {
        fetchCategories();
        fetchBrands();
        fetchSizes();
    }, [])


    return (
        <Layout>

            <div className="container">
                <div className="row">
                    <div className="d-flex justify-content-between mt-5 pb-3">
                        <h4 className='h4 pb-0 mb-0'>Products / Edit</h4>
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
                                                <label htmlFor="" >Category</label>
                                                <select
                                                    {
                                                    ...register("category_id", {
                                                        required: 'The category field is required',
                                                    })
                                                    }
                                                    className={`form-control ${errors.category_id && "is-invalid"}`}>
                                                    <option value="">Select a category</option>
                                                    {
                                                        categories.map((category) => {
                                                            return (
                                                                <option key={category.id} value={category.id}>{category.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                {
                                                    errors.category_id &&
                                                    <p className="invalid-feedback">{errors.category_id?.message}</p>
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="" className="form-label">Brand</label>
                                                <select
                                                    {
                                                    ...register("brand_id")
                                                    }
                                                    className="form-control">
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
                                        <textarea
                                            {
                                            ...register("short_description")
                                            }
                                            className="form-control" rows={3}></textarea>
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
                                                <input
                                                    {
                                                    ...register("price", {
                                                        required: 'The price field is required',
                                                    })
                                                    }
                                                    type="text" placeholder='Price' className={`form-control ${errors.price && "is-invalid"}`} />
                                                {
                                                    errors.price &&
                                                    <p className="invalid-feedback">{errors.price?.message}</p>
                                                }

                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="" className="form-label">Discounted Price</label>
                                                <input

                                                    {
                                                    ...register("compare_price")
                                                    }
                                                    type="text" placeholder='Discounted Price' className='form-control' />

                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="py-3 border-bottom mb-3">Inventory</h3>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="" className="form-label">SKU</label>
                                                <input {
                                                    ...register("sku", {
                                                        required: 'The sku field is required',
                                                    })
                                                } type="text" placeholder='enter SKU' className={`form-control ${errors.sku && "is-invalid"}`} />
                                                {
                                                    errors.sku &&
                                                    <p className="invalid-feedback">{errors.sku?.message}</p>
                                                }

                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="" className="form-label">Barcode</label>
                                                <input
                                                    {
                                                    ...register("barcode")
                                                    }
                                                    type="text" placeholder='barcode' className='form-control' />

                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="" className="form-label">Qty</label>
                                                <input
                                                    {
                                                    ...register("quantity", {
                                                        required: 'The quantity field is required',
                                                    })
                                                    }
                                                    type="text" placeholder='enter quantity' className={`form-control ${errors.quantity && "is-invalid"}`} />
                                                {
                                                    errors.quantity &&
                                                    <p className="invalid-feedback">{errors.quantity?.message}</p>
                                                }

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

                                        <div className="mb-3">
                                            <label htmlFor="" className='form-label'>Featured</label>
                                            <select
                                                {
                                                ...register("is_featured", {
                                                    required: 'please select a featured or not',
                                                    valueAsNumber: true
                                                })
                                                }
                                                className={`form-control ${errors.is_featured && "is-invalid"}`}>
                                                <option value="">Select a is featured</option>
                                                <option value="1">Yes</option>
                                                <option value="0">No</option>
                                            </select>
                                            {
                                                errors.status &&
                                                <p className="invalid-feedback">{errors.status?.message}</p>
                                            }
                                        </div>

                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="" className='form-label'>
                                            Sizes
                                        </label>
                                        {
                                            sizes && sizes.map(size => {
                                                return (
                                                    <div className="form-check-inline ps-2" key={`psize-${size.id}`}>
                                                        <input
                                                            {
                                                            ...register("sizes")
                                                            }
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSizesChecked([...sizesChecked, size.id])
                                                                } else {
                                                                    setSizesChecked(sizesChecked.filter(sid => size.id !== sid))
                                                                }
                                                            }}
                                                            checked={sizesChecked.includes(size.id)}
                                                            type="checkbox" className="form-check-input" value={size.id} id={`size-${size.id}`} />
                                                        <label htmlFor={`size-${size.id}`} className="form-check-label ps-2">
                                                            {size.name}
                                                        </label>

                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                    <h3 className="py-3 border-bottom mb-3">Gallery</h3>

                                    <div className="mb-3">
                                        <label htmlFor="" className="form-label">Image</label>
                                        <input
                                            onChange={handleFile}
                                            type="file" className='form-control' />

                                    </div>

                                    <div className="mb-3">
                                        <div className="row">
                                            {
                                                productImages && productImages.map((productImage, index) => {
                                                    return (
                                                        <div className="col-md-3" key={`image-${index}`}>
                                                            <div className="card shadow">
                                                                <img src={productImage.image_url} alt="" className='w-100' />
                                                            </div>
                                                            <button type='button' className="btn btn-danger mt-3 w-100" onClick={() => deleteImage(productImage.id)}>Delete</button>
                                                            <button type='button' className="btn btn-secondary mt-3 w-100" onClick={() => changeImage(productImage.image)}>Change Image</button>

                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <button disabled={disable} className='btn btn-primary mt-3 mb-5'>Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Edit
