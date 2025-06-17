import { Modal, ModalBody } from "flowbite-react";
import React, { useState } from "react";
import Input from "../Input/input";
import { addDoc, collection } from "firebase/firestore";
import { auth, fetchFromFirestore, fireStore } from "../firebase/firebase";
import { toast } from "react-toastify";
import close from '../../assets/close.svg';
import fileUpload from '../../assets/fileUpload.svg';
import loading from '../../assets/loading.gif';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface SellProps {
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  toggleSellModal: () => void;
  status: boolean;
}

export const Sell = ({ toggleSellModal, status, setItems }: SellProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!auth?.currentUser) {
    return toast.error("Please Login to continue");
  }

  if (!title.trim() || !category.trim() || !description.trim() || !price.trim()) {
    return toast.error("All fields are required");
  }

  setSubmitting(true);

  let imageUrl = "";

  try {
    if (image) {
        console.log("The data of image is ",image);
        const data = new FormData();
        data.append("file",image);
        data.append("upload_preset","olx_image");
        // data.append("folder","productImages");

        
        const res = await fetch(`https://api.cloudinary.com/v1_1/dxluwbtak/image/upload`,{
            method:"POST",
            body:data
        })
         if (!res.ok) {
            throw new Error("Cloudinary upload failed");
        }
        const res_data = await res.json();
        console.log("After image upload",res_data);
        // return '';
        imageUrl = res_data.url;
    }
    // return "";

    await addDoc(collection(fireStore, "products"), {
      title: title.trim(),
      category: category.trim(),
      price: price.trim(),
      description: description.trim(),
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || "Anonymous",
      createdAt: new Date().toISOString(),
      imageUrl, // now a URL, not base64
    });

    const datas = await fetchFromFirestore();
    setItems(datas);

    setTitle("");
    setCategory("");
    setPrice("");
    setDescription("");
    setImage(null);

    toggleSellModal();
    toast.success("Item added successfully!");
  } catch (err) {
    console.error("Failed to add item to firestore", err);
    toast.error("Failed to add item");
  } finally {
    setSubmitting(false);
  }
}

  return (
    <Modal
      theme={{
        content: {
          base: "relative w-full p-4 md:h-auto",
          inner: "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700",
        },
      }}
      onClick={toggleSellModal}
      show={status}
      className="bg-black/50"
      position={"center"}
      size="md"
      popup={true}
    >
      <ModalBody className="bg-white h-full rounded-md" onClick={(e) => e.stopPropagation()}>
        <img
          onClick={() => {
            toggleSellModal();
            setImage(null);
          }}
          className="w-6 absolute z-10 top-6 right-8 cursor-pointer"
          src={close}
          alt="close"
        />

        <div className="p-6 pl-8 pr-8 pb-8">
          <p className="font-bold text-lg mb-3">Sell Item</p>

          <form onSubmit={handleSubmit}>
            <Input setInput={setTitle} placeholder="Title" />
            <Input setInput={setCategory} placeholder="Category" />
            <Input setInput={setPrice} placeholder="Price" />
            <Input setInput={setDescription} placeholder="Description" />

            <div className="pt-2 w-full relative">
              {image ? (
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
              )}
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
  );
};
