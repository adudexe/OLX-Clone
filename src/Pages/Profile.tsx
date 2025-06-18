import { useEffect,useState } from "react";
import { auth,fireStore } from "../Components/firebase/firebase";
import { Navbar } from "../Components/Navbar/Navbar";
import { toast } from "react-toastify";
import { collection, deleteDoc, doc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { Modal,ModalBody } from "flowbite-react";
import Input from "../Components/Input/input";
import loading from "../assets/loading.gif"
import close from "../assets/close.svg";




interface Product {
  id:string;
  title:string;
  description:string;
  price:string;
  imageUrl:string;
  category:string;
  createdAt:string;
  userId:string;
  userName:string;
}

export const Profile:React.FC = () => {
  const [products,setProducts] = useState<Product[]>([]);
  const [toggleModal,setToggleModal] = useState<boolean>(false);
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState('');
  const [category,setCategory] = useState('');
  const [price,setPrice] = useState(''); 
  const [submitting,setSubmitting] = useState('');
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  

  async function fetchProducts(){
    const user = auth.currentUser;
    const data:Product[] = [];
    if(!user) {
      return toast.error("Please Login to continue..");
    }

    const qur = query(collection(fireStore,"products"),where("userId","==",user.uid));
    const querySnapshot = await getDocs(qur);

   querySnapshot.forEach((docSnap) => {
        data.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Product, "id">),
        });
      });
    setProducts(data);
  }

  const handleDelete = async (id:string) => {
    try{
      await deleteDoc(doc(fireStore,"products",id));
      setProducts(products.filter((product) => product.id != id));
      toast.success("Succesfully Deleted");
    } catch(err) {
      console.log("Error in Deleting the Product",err);
      toast.error("Error in deleting the Product");
      return;
    }
  }

  // const handleSubmit = (e:any) => {
  //   e.preventDefault();
  //   console.log(title);

  // }

  const closeModal = () => {
  setToggleModal(false);
  setTitle("");
  setCategory("");
  setPrice("");
  setDescription("");
  setCurrentProductId(null);
  };



  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!currentProductId) return;

  setSubmitting("loading");

  try {
    const productRef = doc(fireStore, "products", currentProductId);
    await updateDoc(productRef, {
      title,
      category,
      price,
      description,
      createdAt: new Date().toISOString(), // optional: update timestamp
    });

    toast.success("Product updated successfully!");
    setToggleModal(false);
    setSubmitting("");
    fetchProducts(); // Refresh list
  } catch (error) {
    console.error("Error updating product:", error);
    toast.error("Failed to update product.");
    setSubmitting("");
  }
};



  const handleUpdate = (item:Product) => {
    setCurrentProductId(item.id)
    setToggleModal(true);
    setTitle(item.title);
    setCategory(item.category);
    setPrice(item.price);
    setDescription(item.description);

  }
  

  useEffect(()=>{
      fetchProducts();
  },[])

  

  return (
    <>
    <Navbar/>
    <div className='p-10 px-5 sm:px-15 md:px-30 lg:px-40 min-h-screen'>
      <h1 style={{ color: '#002f34' }} className="text-2xl">My Products</h1>

      <div  className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-5' >
        {products.map((item)=> (
          <div key={item.id}  
          style={{borderWidth: '1px', borderColor: 'lightgray'}} 
          className='relative w-full h-72 rounded-md border-solid bg-gray-50 overflow-hidden cursor-pointer'
          >
            {/* Display Images */}
            <div  className='w-full flex justify-center p-2 overflow-hidden'>
              <img
              className='h-40  object-contain'
               src={ item.imageUrl  || 'https://via.placeholder.com/150/0000FF/808080'}  alt={item.title} />
            </div>

            {/* Display details */}
            <div  className='flex justify-between details p-1 pl-4 pr-4' >
              <div>
                <h1 style={{ color: '#002f34' }} className="font-bold text-xl">₹ {item.price}</h1>
                <p className="text-sm pt-2">{item.category}</p>
                <p className="pt-2">{item.title}</p>
              </div>
              <div className="flex flex-col justify-evenly">
                <button className="bg-green-500 text-center p-1 px-2 rounded-md" onClick={() => handleUpdate(item)} >Update</button>
                <button className="bg-red-600 text-center p-1 px-2 rounded-md" onClick={() => handleDelete(item.id)} >Delete</button>
              </div>
            </div>
          </div>
        ))}

      </div>


      <Modal
      theme={{
        content: {
          base: "relative w-120 p-4 md:h-auto",
          inner: "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700",
        },
      }}
      show={toggleModal}
      className="bg-black/50"
      position={"center"}
      size="md"
      popup={true}
    >
      <ModalBody className="bg-white h-full rounded-md" onClick={(e) => e.stopPropagation()}>
        <img
          onClick={() => {
            setToggleModal(!toggleModal);
            closeModal();
          }}
          className="w-6 absolute z-10 top-6 right-8 cursor-pointer"
          src={close}
          alt="close"
        />

        <div className="p-6 pl-8 pr-8 pb-8">
          <p className="font-bold text-lg mb-3">Sell Item</p>

          <form onSubmit={handleSubmit}>
            <Input setInput={setTitle} placeholder="Title" value={title} />
            <Input setInput={setCategory} placeholder="Category" value={category} />
            <Input setInput={setPrice} placeholder="Price" value={price} />
            <Input setInput={setDescription} placeholder="Description" value={description} />

            <div className="pt-2 w-full relative">
              {/* {image ? (
                <div className="relative h-40 sm:h-60 w-full flex justify-center border-2 border-black border-solid rounded-md overflow-hidden">
                  <img className="object-fit" src={URL.createObjectURL(image)} alt="preview" />
                </div>
              ) : (
                <div className="relative h-40 sm:h-60 w-full border-2 border-black border-solid rounded-md">
                  <input
                    onChange={handleImageUpload}
                    type="file"
                    className="absolute inset-1 h-full w-full opacity-0 cursor-pointer z-30"
                    required
                    accept="image/*"
                  />
                  <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center">
                    <img className="w-12" src={fileUpload} alt="upload" />
                    <p className="text-center text-sm pt-2">Click to upload images</p>
                    <p className="text-center text-sm pt-2">SVG, PNG, JPG</p>
                  </div>
                </div>
              )} */}
            </div>

            {submitting ? (
              <div className="w-full flex h-14 justify-center pt-4 pb-2">
                <img className="w-32 object-cover" src={loading} alt="loading" />
              </div>
            ) : (
              <div className="w-full pt-2">
                <button
                  type="submit"
                  className="w-full p-3 rounded-lg text-white"
                  style={{ backgroundColor: "#002f34" }}
                >
                  Sell Item
                </button>
              </div>
            )}
          </form>
        </div>
      </ModalBody>
    </Modal>
    </div>

    </>
  )
}
