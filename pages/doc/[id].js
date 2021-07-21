import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import { useSession, getSession, signIn, signOut } from "next-auth/client";
import Login from "../../components/Login";
import { db } from "../../firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import DocumentDisplay from "../../components/DocumentDisplay";
import { useRouter } from "next/router";
import TextEditor from "../../components/TextEditor";
function Doc() {
  const [session] = useSession();
  if (!session) return <Login />;
  const router = useRouter();
  const { id } = router.query;
  const [snapshot, loadingSnapshot] = useDocumentOnce(
    db.collection("userDocs").doc(session.user.email).collection("docs").doc(id)
  );
  if (!loadingSnapshot && !snapshot?.data()?.filename) {
    router.replace("/"); //redirects user if they don't have access
  }
  return (
    <div>
      <header className="flex justify-between items-center p-3 pb-1 cursor-pointer">
        <span onClick={() => router.push("/")}>
          <Icon name="description" size="5xl" color="teal" />
        </span>
        <div className="flex-grow px-2">
          <h2>{snapshot?.data()?.filename}</h2>
          <div className="flex items-center text-sm space-x-1 -ml-1 h-6 mb-1 text-gray-600">
            <p className="option">File</p>
            <p className="option">Edit</p>
            <p className="option">View</p>
            <p className="option">Insert</p>
            <p className="option">Format</p>
            <p className="option">Tools</p>
          </div>
        </div>
        <Button
          color="teal"
          buttonType="filled"
          size="regular"
          className="hidden md:inline-flex h-10"
          rounded={false}
          iconOnly={false}
          ripple="light"
        >
          Share <Icon name="people" size="md" />
        </Button>
        <img
          className="rounded-full cursor-pointer h-14 w-14 ml-8"
          src={session.user.image}
          alt=""
        />
      </header>
      <TextEditor />
    </div>
  );
}

export default Doc;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
