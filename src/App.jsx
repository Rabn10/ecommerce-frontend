import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Shop from './components/Shop'
import Product from './components/Product'
import Cart from './components/Cart'
import CheckOut from './components/CheckOut'
import Login from './components/admin/Login'
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from './components/admin/Dashboard'
import { AdminRequireAuth } from './components/admin/AdminRequireAuth'

import { default as ShowCategories } from './components/admin/category/Show'
import { default as CreateCategories } from './components/admin/category/Create'
import { default as EditCategories } from './components/admin/category/Edit'

import { default as ShowBrands } from './components/admin/brand/Show'
import { default as CreateBrands } from './components/admin/brand/Create'
import { default as EditBrands } from './components/admin/brand/Edit'

import { default as ShowProducts } from './components/admin/product/Show'
import { default as CreateProducts } from './components/admin/product/Create'
import { default as EditProducts } from './components/admin/product/Edit'
import Register from './components/Register'
import { default as UserLogin } from './components/Login'
import Profile from './components/Profile'
import { RequireAuth } from './components/RequireAuth'
import Confirmation from './components/Confirmation'
import ShowOrders from './components/admin/orders/showOrders'
import OrderDetail from './components/admin/orders/OrderDetail'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* user Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          {/* <Route path="/checkout" element={<CheckOut />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<UserLogin />} />

          <Route path="/profile" element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          } />

          <Route path="/checkout" element={
            <RequireAuth>
              <CheckOut />
            </RequireAuth>
          } />

          <Route path="/order/confirmation/:id" element={
            <RequireAuth>
              <Confirmation />
            </RequireAuth>
          } />

          {/* admin routes */}
          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin/dashboard" element={
            <AdminRequireAuth>
              <Dashboard />
            </AdminRequireAuth>
          } />

          <Route path="/admin/categories" element={
            <AdminRequireAuth>
              <ShowCategories />
            </AdminRequireAuth>
          } />

          <Route path="/admin/categories/create" element={
            <AdminRequireAuth>
              <CreateCategories />
            </AdminRequireAuth>
          } />

          <Route path="/admin/categories/edit/:id" element={
            <AdminRequireAuth>
              <EditCategories />
            </AdminRequireAuth>
          } />

          <Route path="/admin/brands" element={
            <AdminRequireAuth>
              <ShowBrands />
            </AdminRequireAuth>
          } />

          <Route path="/admin/brands/create" element={
            <AdminRequireAuth>
              <CreateBrands />
            </AdminRequireAuth>
          } />

          <Route path="/admin/brands/edit/:id" element={
            <AdminRequireAuth>
              <EditBrands />
            </AdminRequireAuth>
          } />

          <Route path="/admin/products" element={
            <AdminRequireAuth>
              <ShowProducts />
            </AdminRequireAuth>
          } />

          <Route path="/admin/products/create" element={
            <AdminRequireAuth>
              <CreateProducts />
            </AdminRequireAuth>
          } />

          <Route path="/admin/products/edit/:id" element={
            <AdminRequireAuth>
              <EditProducts />
            </AdminRequireAuth>
          } />

          <Route path="/admin/orders" element={
            <AdminRequireAuth>
              <ShowOrders />
            </AdminRequireAuth>
          } />

          <Route path="/admin/orders/:id" element={
            <AdminRequireAuth>
              <OrderDetail />
            </AdminRequireAuth>
          } />



        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App
