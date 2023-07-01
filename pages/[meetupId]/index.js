import Head from "next/head";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";

const MeetupDetailPage = function (props) {
  console.log(props);

  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description}></meta>
      </Head>
      <MeetupDetail {...props.meetupData}></MeetupDetail>
    </>
  );
};

export default MeetupDetailPage;

export const getStaticProps = async function (context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://engr-mervin:U19gVfoACWlvz0MQ@cluster0.h07etce.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetup = await meetupsCollection.findOne(new ObjectId(meetupId));
  client.close();

  return {
    props: {
      meetupData: {
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        description: meetup.description,
        id: meetup._id.toString(),
      },
    },
  };
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://engr-mervin:U19gVfoACWlvz0MQ@cluster0.h07etce.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();
  return {
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
    fallback: false,
  };
}
