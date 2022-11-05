import UserLayout from "../../components/layouts/UserLayout";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AppUrl from "../../service/AppUrl";
import Api from "../../service/Api";
import { toast } from "react-toastify";
import AuthenticatedRoute from "../../components/AuthenticatedRoute";
import AppStorage from "../../service/AppStorage";
import { Row, Col } from "react-bootstrap";
import Select from "react-select";
import { RMIUploader } from "react-multiple-image-uploader";

const ProductCreate = () => {
  const [errors, setErrors] = useState("");
  const [processing, setProcessing] = useState(false);
  const initialState = {
    user_id: "",
    name: "",
    price: "",
  };
  const [data, setData] = useState(initialState);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [files, setFiles] = useState([]);
  const [attribute, setAttribute] = useState([{ index: 0 }]);

  const [visible, setVisible] = useState(false);

  const dataSources = [];

  const hideModal = () => {
    setVisible(false);
  };
  const onUpload = (data) => {
    setFiles(data);
    toast.success(
      "Image uploaded to temp after save operation excution it will be uploaded to server."
    );
    console.log("Upload files", data);
  };
  const onSelect = (data) => {
    console.log("Select files", data);
  };
  const onRemove = (id) => {
    console.log("Remove image id", id);
  };

  const getCategories = () => {
    try {
      axios
        .get(AppUrl.categories, { headers: Api.getHeaders() })
        .then((response) => {
          const data = getCategoryOptions(response.data);
          setCategories(data);
        });
    } catch (error) {}
  };

  const getCategoryOptions = (categories) => {
    let data = [];
    for (let key in categories) {
      let valueData = categories[key];
      data.push({
        value: valueData.id,
        label: valueData.name,
      });
    }
    return data;
  };

  const addAttribute = (val) => {
    const demo = [...attribute, { index: val, close: "active" }];
    setAttribute(demo);
  };

  const removeAttribute = (value) => {
    const demo = attribute.filter((data) => {
      return data.index !== value;
    });
    setAttribute(demo);
  };

  const sizeHandler = (val, index) => {
    const data = [...size, { key: index, val: val }];
    setSize(data);
  };

  const colorHandler = (val, index) => {
    const data = [...color, { key: index, val: val }];
    setColor(data);
  };

  useEffect(() => {
    const getUser = AppStorage.getUser();
    if (getUser) {
      setData({
        ...data,
        user_id: getUser.id,
      });
    }
    getCategories();
  }, []);

  const changeHandler = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleChange = (eData) => {
    setSelectedCategories(eData);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setProcessing(true);
    let formData = new FormData();
    formData.append("name", data.name);
    formData.append("user_id", data.user_id);
    formData.append("price", data.price);
    formData.append("sizes", size);
    formData.append("colors", color);
    files && files
      .forEach(function (data) {
        formData.append("product_images[]", data.file);
      });
    selectedCategories && selectedCategories
      .map((category) => category.value)
      .forEach(function (data) {
        formData.append("category_ids[]", data);
      });
    await axios
      .post(AppUrl.products, formData, { headers: Api.getHeaders() })
      .then((res) => {
        if (res.data && res.data.status === "success") {
          toast.success(res.data.message);
          setProcessing(false);
          setErrors("");
        }
      })
      .catch((error) => {
        setProcessing(false);
        setErrors(error.response.data.errors);
      });
  };
  const styles = {
    background: "#fafafa",
    borderRadius: "5px",
    padding: "20px",
  };
  return (
    <UserLayout style={styles}>
      <Head>
        <title>Add Product</title>
      </Head>
      <Row>
        <form onSubmit={submitHandler} id="form" className="d-flex">
          <div className="col-md-12 mx-3">
            <div className="d-flex justify-content-between">
              <h1>Add Product</h1>
            </div>
            <div className="form mt-5">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <div className="input-field">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    required
                    onChange={changeHandler}
                  />
                  <span>Enter product name</span>
                  {errors && errors.name && (
                    <h5 className="text-danger mt-2">{errors.name[0]}</h5>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="categories" className="form-label">
                  Categories
                </label>
                <div className="input-field">
                  <Select
                    id="categories"
                    placeholder="Select categories"
                    name="category_ids[]"
                    isMulti={true}
                    options={categories}
                    onChange={handleChange}
                    closeMenuOnSelect={false}
                    className="h5"
                  />
                  {errors && errors.tags && (
                    <h5 className="text-danger mt-2">
                      {errors.category_ids[0]}
                    </h5>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="recipe_price" className="form-label">
                  Price
                </label>
                <div className="input-field">
                  <input
                    id="price"
                    type="number"
                    className="form-control"
                    name="price"
                    required
                    onChange={changeHandler}
                    step="0.01"
                    onKeyDown={(event) =>
                      ["e", "E", "+", "-"].includes(event.key) &&
                      event.preventDefault()
                    }
                  />
                  <span>Enter product price</span>
                  {errors && errors.price && (
                    <h5 className="text-danger mt-2">{errors.price[0]}</h5>
                  )}
                </div>
              </div>
              {attribute.map((data, index) => {
                return (
                  <div className="mb-3" key={index}>
                    <Row>
                      <Col md={4}>
                        <label>Size: </label>
                        <input
                          className="form-control"
                          type="text"
                          name="size"
                          required
                          onChange={(e) => sizeHandler(e.target.value, index)}
                        />
                      </Col>
                      <Col md={4}>
                        <label>Color: </label>
                        <input
                          className="form-control"
                          type="text"
                          name="color"
                          required
                          onChange={(e) => colorHandler(e.target.value, index)}
                        />
                      </Col>
                      <Col md={4}>
                        <button
                          className="btn btn-primary rounded-5 mt-5"
                          type="button"
                          onClick={() => addAttribute(index + 1)}
                        >
                          Add more
                        </button>
                        {data.close ? (
                          <button
                            className="btn btn-danger rounded-5 mt-5 mx-2"
                            type="button"
                            onClick={() => removeAttribute(index)}
                          >
                            Delete
                          </button>
                        ) : (
                          ""
                        )}
                      </Col>
                    </Row>
                  </div>
                );
              })}
              <div className="mb-3">
                <label htmlFor="product_images" className="form-label">
                  Product Images
                </label>
                <RMIUploader
                  isOpen={visible}
                  hideModal={hideModal}
                  onSelect={onSelect}
                  onUpload={onUpload}
                  onRemove={onRemove}
                  dataSources={dataSources}
                />
              </div>
            </div>
            <button
              className="px-5 btn btn-primary rounded-5"
              type="submit"
              disabled={processing}
            >
              {processing ? (
                <>
                  <i className="fa fa-spin fa-spinner mr-2" />
                  Processing...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </Row>
    </UserLayout>
  );
};

export default AuthenticatedRoute(ProductCreate);
