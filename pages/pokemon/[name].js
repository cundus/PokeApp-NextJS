import { useQuery } from "@apollo/client";
import { Button, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/dist/client/router";
import { useContext, useEffect, useState } from "react";
import { GET_POKEMON } from "../../data/apollo";
import Image from "next/image";
import Chip from "@mui/material/Chip";
import HeightIcon from "@mui/icons-material/Height";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import Box from "@mui/material/Box";
import PokeBall from "../../assets/pokebal.webp";
import DetailCss from "../../styles/Detail.module.css";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Drawer from "@mui/material/Drawer";
import Head from "next/head";
import { AppContext } from "../../context/AppContext";
import ModalCatch from "../../component/ModalCatch";

const barColor = [
  "#80B918",
  "#D00000",
  "#6C757D",
  "#4D194D",
  "#023E8A",
  "#FFBE0B",
];

const BorderLinearProgress = styled(LinearProgress)(({ theme, ...props }) => {
  // console.log(props);
  return {
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: props.className,
    },
  };
});

export default function DetailPokemon() {
  const router = useRouter();
  const { name } = router.query;
  const [drawerShow, setDrawerShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const { state, dispatch } = useContext(AppContext);
  const { data, loading, error } = useQuery(GET_POKEMON, {
    ssr: true,
    variables: { name: name },
  });

  // console.log({ loading, error, data });

  const [cached, setCached] = useState(true);
  useEffect(() => {
    if (loading) setCached(false);
  }, [loading]);

  const toggleDrawer = () => {
    setDrawerShow(!drawerShow);
  };

  const toggleModal = () => {
    setOpen(!open);
  };

  const allClose = () => {
    toggleModal();
    toggleDrawer();
  };

  const handleCatch = () => {
    let probability = Math.floor(Math.random() * 10 + 1);
    // console.log(probability);

    dispatch({
      type: "USE_CATCH",
    });
    console.log(state);

    if (probability >= 1 && probability <= 3) {
      // show modal catched
      toggleModal();
      setModalSuccess(true);
      console.log("catched");
    } else {
      // show modal failed
      toggleModal();
      setModalSuccess(false);
      console.log("failed");
    }
  };

  const catchMe = () => (
    <Box sx={{ width: "auto", px: 2, py: 4 }} role="presentation">
      <Stack direction="row" alignItems="center" spacing={1}>
        <Image src={PokeBall} alt="pokeball" height={35} width={35} />
        <Typography>{state.chance} Left</Typography>
      </Stack>
      <Typography textAlign="center" variant="h3" p={2}>
        Catch Me !!!
      </Typography>
      <Stack direction="row" justifyContent="center" sx={{ mt: 15 }}>
        <Button
          className={DetailCss.ball}
          onClick={handleCatch}
          sx={{ borderRadius: "50%" }}
        >
          <Image src={PokeBall} alt="pokeball" height={80} width={80} />
        </Button>
      </Stack>
      <hr style={{ border: "2px solid black", margin: 0 }} />
      <ModalCatch
        open={open}
        status={modalSuccess}
        data={modalProps}
        handleClose={toggleModal}
        allClose={allClose}
      />
    </Box>
  );

  if (loading) return "Loading...";

  const modalProps = {
    name: name,
    image: data.pokemon.sprites.front_default,
  };

  return (
    <>
      <Head>
        <title>PokeApp | Detail</title>
        <meta name="description" content="detail Pokemon" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="xl">
        <Stack direction="column" mt={2} spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  bgcolor: "#D9DBE1",
                  borderRadius: "50%",
                  boxSizing: "border-box",
                  height: "100px",
                }}
              >
                <Image
                  src={data.pokemon.sprites.front_default}
                  alt={data.pokemon.name}
                  width={100}
                  height={100}
                />
              </Box>
              <Stack sx={{ color: "#4C4C4D" }}>
                <Typography
                  sx={{ textTransform: "capitalize", fontWeight: "500" }}
                >
                  {data.pokemon.name}
                </Typography>
                <Typography>
                  <HeightIcon fontSize="md" /> {data.pokemon.height} inch{" "}
                  <FitnessCenterIcon fontSize="md" /> {data.pokemon.weight} kg
                </Typography>
                <Stack direction="row" spacing={1}>
                  {data.pokemon.types.map((item, i) => (
                    <Chip
                      label={item.type.name}
                      variant="outlined"
                      size="small"
                      key={i}
                    />
                  ))}
                </Stack>
              </Stack>
            </Stack>

            <Button sx={{ borderRadius: "50%" }} onClick={toggleDrawer}>
              <Image
                src={PokeBall}
                alt={data.pokemon.name}
                width={85}
                height={85}
                className={DetailCss.pokeball}
              />
            </Button>
          </Stack>
          <Typography>Base Stats</Typography>
          <Stack spacing={1}>
            {data.pokemon.stats.map((item, index) => {
              const myColor = barColor.find((color, i) => {
                if (i === index) return color;
              });
              // console.log(myColor);
              return (
                <Box key={index}>
                  <Typography sx={{ textTransform: "capitalize" }}>
                    {item.stat.name}
                  </Typography>
                  <BorderLinearProgress
                    variant="determinate"
                    value={item.base_stat > 100 ? 100 : item.base_stat}
                    className={myColor}
                  />
                </Box>
              );
            })}
          </Stack>
          <Stack spacing={1}>
            <Typography mt={2}>Abilities</Typography>
            <Stack direction="row" spacing={2}>
              {data.pokemon.abilities.map((ability, i) => (
                <Button
                  key={i}
                  sx={{
                    width: "100%",
                    bgcolor: "#429e84",
                    border: "2px solid #0081A7",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#58B89D",
                      boxShadow: 3,
                    },
                  }}
                >
                  {ability.ability.name}
                </Button>
              ))}
            </Stack>
          </Stack>
          <Box>
            <Accordion sx={{ mt: 2, "&:hover": { boxShadow: 3 } }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography p={1}>Moves</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {data.pokemon.moves.map((move, i) => (
                  <Chip
                    variant="outlined"
                    size="small"
                    label={move.move.name}
                    key={i}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Stack>
        <Drawer anchor="bottom" open={drawerShow} onClose={toggleDrawer}>
          {catchMe()}
        </Drawer>
      </Container>
    </>
  );
}
