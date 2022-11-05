import Link from "next/link";
import { useRouter } from "next/router";

const UserLayoutLinks = () => {
  const router = useRouter();

  return (
    <div className="d-navigation">
      <ul>
        <li className='active'>
          <Link href={`/products`}>
            <a>Products</a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserLayoutLinks;
