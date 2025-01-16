import { GetServerSideProps, InferGetServerSidePropsType } from "next"

type Segment = {
  "id": number;
  "name": string;
  "distance": number;
  "map": {
    "id": string;
    "polyline": string;
    "resource_state": number;
  },
  "effort_count": 66881,
  "athlete_count": 9630,
}

type Segments = {
  segments: Segment[]
}

export const getServerSideProps = (async () => {
  const res = await fetch(`${process.env.API_URL}/getSegments`)
  const data: Segments = await res.json()

  return {props: {data}}
}) satisfies GetServerSideProps<{data: Segments}>

export default function Home({data}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <div>{data.segments.map(e => e.name)}</div>
}
