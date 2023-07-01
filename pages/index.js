import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";

const HomePage = function (props) {
  return (
    <>
      <Head>
        <title>React Meetups</title>
      </Head>
      <MeetupList meetups={props.meetups}></MeetupList>
    </>
  );
};

export default HomePage;

export const getStaticProps = async function () {
  const client = await MongoClient.connect(
    "mongodb+srv://engr-mervin:U19gVfoACWlvz0MQ@cluster0.h07etce.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },

    revalidate: 10,
  };
};

// export const getServerSideProps = async function (context) {
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// };
