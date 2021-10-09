import { useQuery } from "@apollo/client";
import { Container, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import PokemonCard from "../../component/PokemonCard";
import { AppContext } from "../../context/AppContext";
import { GET_POKEMONS } from "../../data/apollo";

export default function Pokemon() {
  const { data, loading, error } = useQuery(GET_POKEMONS, { ssr: true });
  const { state } = useContext(AppContext);
  // console.log(state);

  const [cached, setCached] = useState(true);
  useEffect(() => {
    if (loading) setCached(false);
  }, [loading]);

  if (loading) return "Loading...";

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        {data.pokemons.results.map((item) => (
          <Grid item sm={6} md={2} key={item.id}>
            <PokemonCard image={item.image} name={item.name} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

// export const
