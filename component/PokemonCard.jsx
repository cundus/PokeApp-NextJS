import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/dist/client/router";

function PokemonCard(props) {
  const router = useRouter();
  const { name, image } = props;

  const handleDetail = (e) => {
    e.preventDefault();
    router.push(`/pokemon/${name}`);
  };

  return (
    <Card
      onClick={handleDetail}
      sx={{
        maxWidth: "xl",
        minWidth: "xl",
        p: 3,
        "&:hover": {
          cursor: "pointer",
          boxShadow: 4,
          bgcolor: "rgb(0 0 0 /10%)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="100"
        width="xl"
        image={image}
        alt={name}
        sx={{ objectFit: "contain" }}
      />
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          textAlign="center"
          fontSize="sm"
          sx={{ textTransform: "capitalize", fontWeight: 500 }}
        >
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default PokemonCard;
