import UserLayout from "../components/layouts/UserLayout";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AppUrl from "../service/AppUrl";
import Api from "../service/Api";
import { Space, Table, Dropdown, Menu } from "antd";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/router";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import "antd/dist/antd.css";

const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const getData = () => {
    try {
      axios
        .get(AppUrl.products, { headers: Api.getHeaders() })
        .then((response) => {
          setData(response.data);
          setLoading(false);
        });
    } catch (error) {}
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteProduct = (slug) => {
    try {
      axios
        .delete(AppUrl.products + "/" + slug, {
          headers: Api.getHeaders(),
        })
        .then((response) => {
          toast.success(response.data.message);
          getData();
        });
    } catch (error) {}
  };

  const showProduct = (slug) => {
    router.push(`/product/${slug}`);
  };


  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Price ($)",
      dataIndex: "price",
      key: "price",
      render: (_, recipe) => <p>{recipe.price}</p>,
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Action",
      key: "action",
      render: (_, product) => (
        <Space size="middle">
          <Dropdown
            trigger={["click"]}
            placement="top"
            arrow
            overlay={
              <Menu
                items={[
                  {
                    key: "1",
                    label: (
                      <a
                        onClick={() => {
                          showProduct(product.slug);
                        }}
                      >
                        Show
                      </a>
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <a
                        onClick={() => {
                          const confirmBox = window.confirm(
                            "Do you really want to delete?"
                          );
                          if (confirmBox === true) {
                            deleteProduct(product.slug);
                          }
                        }}
                      >
                        Delete
                      </a>
                    ),
                  },
                ]}
              />
            }
          >
            <i className="fas fa-ellipsis-v" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const styles = {
    background: "#fafafa",
    borderRadius: "5px",
    padding: "20px",
  };
  return (
    <UserLayout style={styles}>
      <Head>
        <title>List of Products</title>
        <meta name="description" content="Product details" />
      </Head>
      <div className="d-flex justify-content-between align-items-baseline">
        <h4 className="section-title">
          {data.total < 1 ? "No result found!" : "List of Products"}
        </h4>
        <Link href="/product/create">
          <a className="btn btn-primary float-right mb-4 px-4">Add Product</a>
        </Link>
      </div>
      <hr />
      {loading ? (
        <p className="text-center">
          <i className="fa fa-spin fa-spinner mr-2" />
          Loading...
        </p>
      ) : (
        <div className="row w-100">
          <Table
            columns={columns}
            dataSource={data.filter((row) => {
              return (
                row.name.toString().toLowerCase() ||
                row.price.toString().toLowerCase()
              );
            })}
          />
          {!loading && data.length < 1 && (
            <p className="text-center">No result found!</p>
          )}
        </div>
      )}
    </UserLayout>
  );
};

export default AuthenticatedRoute(Products);
