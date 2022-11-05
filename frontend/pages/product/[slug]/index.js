import UserLayout from "../../../components/layouts/UserLayout";
import Head from "next/head";
import AuthenticatedRoute from "../../../components/AuthenticatedRoute";
import axios from "axios";
import AppUrl from "../../../service/AppUrl";
import Api from "../../../service/Api";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Product = () => {
  const router = useRouter();
  const [product, setProduct] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(AppUrl.products + `/${router.query.slug}`, {
          headers: Api.getHeaders(),
        })
        .then((response) => {
          setProduct(response.data);
        });
    } catch (error) {}
  }, []);

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <UserLayout>
      <Head>
        <title>Product</title>
      </Head>
      <div className="text-center">
        <h4 className="section-title">Product - {product.name}</h4>
        {product && product.product_images
          ? product.product_images.map((data, index) => {
              return (
                <img
                  key={index}
                  src={data.image_url}
                  alt={product.name}
                  height={150}
                  width={150}
                />
              );
            })
          : ""}
      </div>

      <div className="form-submit">
        <div className="submit-section mt-3">
          <table className="table table-striped table-borderless">
            <tr>
              <th width="18%">Categories</th>
              <th width="1%">:</th>
              <td>
                {product && product.category
                  ? product.category.map((data) => {
                      return <>({capitalize(data.name)}) </>;
                    })
                  : ""}
              </td>
            </tr>
            <tr>
              <th width="18%">Price</th>
              <th width="1%">:</th>
              <td>{product.price}</td>
            </tr>
            <tr>
              <th width="18%">Size, Color</th>
              <th width="1%">:</th>
              <td>
                {product && product.product_attributes
                  ? product.product_attributes.map((data) => {
                      return (
                        <>
                          ({capitalize(data.size)} {capitalize(data.color)}){" "}
                        </>
                      );
                    })
                  : ""}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </UserLayout>
  );
};

export default AuthenticatedRoute(Product);
