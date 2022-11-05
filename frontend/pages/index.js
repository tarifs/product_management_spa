import Head from "next/head";
import Image from "next/image";
import homeImage from "../public/assets/img/home_image.jpg"

function Home() {
  return (
    <div>
      <Head>
        <title>Appnap Store</title>
      </Head>
      <div className="text-center">
        <Image
          src={homeImage}
          width={800}
          height={500}
        />
      </div>
    </div>
  );
}

export default Home;
