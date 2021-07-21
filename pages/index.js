import Head from "next/head";
import Header from "../components/Header";
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import Modal from "@material-tailwind/react/Modal";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Image from "next/image";
import { useSession, getSession, signIn, signOut } from "next-auth/client";
import Login from "../components/Login";
import { useState } from "react";
import { db } from "../firebase";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import DocumentDisplay from "../components/DocumentDisplay";
export default function Home() {
  const [session] = useSession();

  if (!session) return <Login />;
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const [snapshot] = useCollectionOnce(
    db
      .collection("userDocs")
      .doc(session.user.email)
      .collection("docs")
      .orderBy("timestamp", "desc")
  );
  const createDocument = () => {
    if (!input) return; //ensure no empty docs

    db.collection("userDocs").doc(session.user.email).collection("docs").add({
      filename: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
    setShowModal(false);
  };
  const modal = (
    <Modal size="sm" active={showModal} toggler={() => setShowModal(false)}>
      <ModalBody>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="outline-none w-full"
          placeholder="Enter Document Name"
          onKeyDown={(e) => e.key === "Enter" && createDocument()}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="teal" onClick={createDocument} ripple="light">
          Create
        </Button>
        <Button
          color="red"
          buttonType="link"
          onClick={(e) => setShowModal(false)}
          ripple="dark"
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
  return (
    <div>
      <Head>
        <title>Text editor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {modal}
      <section className="bg-blue-50 pb-10 px-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between py-6">
            <h2 className="text-gray-700 text-lg">New Document</h2>
            <Button
              color="gray"
              buttonType="outline"
              rounded={true}
              iconOnly={true}
              ripple="dark"
              className=" md:inline-flex h-20 w-20 border-0"
            >
              <Icon name="more_vert" size="3xl" />
            </Button>
          </div>
          <div
            onClick={() => setShowModal(true)}
            className="relative h-52 w-40 border-2 cursor-pointer hover:border-blue-400 hover:shadow-2xl"
          >
            <Image
              src="https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png"
              layout="fill"
            />
          </div>
          <p className="ml-2 mt-2 font-semibold text-sm text-gray-700">
            Click to create new doc
          </p>
        </div>
      </section>
      <section className="bg-white px-10">
        <div className="max-w-3xl mx-auto py-8 text-sm text-gray-700">
          <div className="flex items-center justify-between pb-5">
            <h2 className="font-medium flex-grow">My Documents</h2>
            <p className="mr-12">Date Created</p>
            <Icon name="folder" size="3xl" color="gray" />
          </div>

          {snapshot?.docs.map((doc) => (
            <DocumentDisplay
              key={doc.id}
              id={doc.id}
              fileName={doc.data().filename}
              date={doc.data().timestamp}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
