import {
  Button,
  Container,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import CatchImage from "../assets/catch.webp";
import NoCatchImage from "../assets/notcatch.webp";
import Image from "next/image";
import { useRouter } from "next/router";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30rem",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  textAlign: "center",
};

const SuccessModal = ({ name, image, close }) => {
  const { state, dispatch } = useContext(AppContext);
  const [nameState, setNameState] = useState("");
  const [errorText, setErrorText] = useState("");
  const [error, setError] = useState(false);

  const router = useRouter();

  const onAddPokemon = (e) => {
    e.preventDefault();
    if (nameState.length < 1) {
      setError(true);
      setErrorText("Pokemon Name Is Required");
      return;
    } else if (nameState.length === 1) {
      setError(true);
      setErrorText("Minimum is 2 character ");
      return;
    }

    dispatch({
      type: "ADD_POKEMON",
      payload: { name: name, image: image },
    });

    dispatch({
      type: "SAVE_DATA",
    });
    close();
    // router.push(`/pokemon/${name}`);
  };
  return (
    <Container>
      <Stack>
        <Box>
          <Image src={CatchImage} alt="success" layout="responsive" />
        </Box>
        <Typography sx={{ textAlign: "center", fontSize: "24px", mb: 4 }}>
          Success Catch
        </Typography>
        {error ? (
          <TextField
            onChange={(e) => setNameState(e.target.value)}
            value={nameState}
            id="Name"
            label="Give your Pokemon Name"
            variant="outlined"
            size="small"
            error
            onFocus={() => setError(false)}
            helperText={errorText}
          />
        ) : (
          <TextField
            onChange={(e) => setNameState(e.target.value)}
            value={nameState}
            id="Name"
            label="Give your Pokemon Name"
            variant="outlined"
            size="small"
          />
        )}

        <Button
          onClick={onAddPokemon}
          sx={{
            color: "yellow",
            bgcolor: "teal",
            mt: 2,
            fontSize: 20,
            px: 5,
            outline: "3px solid yellow",
            "&:hover": {
              bgcolor: "rgba(0, 128, 128, 0.5)",
            },
          }}
        >
          ADOPT POKEMON
        </Button>
      </Stack>
    </Container>
  );
};

const FailedModal = () => {
  return (
    <Container>
      <Stack>
        {/* image */}
        <Typography>FAILED</Typography>
      </Stack>
    </Container>
  );
};

const ModalCatch = (props) => {
  const { open, handleClose, data, status, allClose } = props;

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box bgcolor="white" sx={{ ...style }}>
          {status ? (
            <SuccessModal
              name={data.name}
              image={data.image}
              close={allClose}
            />
          ) : (
            <>
              <FailedModal />
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ModalCatch;
