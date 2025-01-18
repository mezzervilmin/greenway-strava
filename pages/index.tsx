import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRef, useEffect } from "react";
import mapboxgl, { Map } from "mapbox-gl";

import "../app/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

type Segment = {
  id: number;
  name: string;
  distance: number;
  map: {
    id: string;
    polyline: [number, number][];
    resource_state: number;
  };
  effort_count: number;
  athlete_count: number;
};

type Segments = {
  segments: Segment[];
};

export const getServerSideProps = (async () => {
  const res = await fetch(`${process.env.API_URL}/getSegments`);
  const data: Segments = await res.json();

  return { props: { data } };
}) satisfies GetServerSideProps<{ data: Segments }>;

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiY3JhcHB5b2F0cyIsImEiOiJjbTYxYmJhcXgwb2NjMmpvcGVpNWlzZmp2In0.etPSqCFyDIg2MuMHKnh63A";

    if (mapContainerRef?.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
      });
      mapRef.current.on("load", function () {
        mapRef.current?.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: data.segments[0].map.polyline,
            },
          },
        });
        mapRef.current?.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#F7455D",
            "line-opacity": 0.75,
            "line-width": 5,
          },
        });
      });
    }

    return () => {
      mapRef.current?.remove();
    };
  });

  return (
    <>
      <div id="map-container" ref={mapContainerRef} />
    </>
  );
}
