import { alpha, styled } from "@mui/material/styles";
import { Box, Grid, RadioGroup, CardActionArea } from "@mui/material";
import { useSelector } from "@/app/redux/store";
import { changeColorPreset } from "../Utils/tema";
import { CoresVariantes, presetsDeCores } from "@/app/theme/type";

const BoxStyle = styled(CardActionArea)(({ theme }) => ({
  height: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.disabled,
  border: `solid 0.3px #CCC3`,
  borderRadius: Number(theme.shape.borderRadius) * 1.25,
}));

export default function SettingColorPresets() {
  const corAtual = useSelector((state) => state.theme.indexColor);
  return (
    <RadioGroup name="themeColorPresets">
      <Grid dir="ltr" container spacing={1.5}>
        {presetsDeCores.map((color: CoresVariantes, i: number) => {
          const colorIndex = i;
          const colorValue = color.main;
          const isSelected = colorIndex === corAtual;

          return (
            <Grid key={i} item xs={4}>
              <BoxStyle
                onClick={() => {
                  changeColorPreset(colorIndex);
                }}
                sx={{
                  ...(isSelected && {
                    bgcolor: alpha(colorValue, 0.08),
                    border: `solid 0.3px ${colorValue}`,
                    boxShadow: `inset 0 4px 8px 0 ${alpha(colorValue, 0.24)}`,
                  }),
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 14,
                    borderRadius: "50%",
                    bgcolor: colorValue,
                    transform: "rotate(-45deg)",
                    transition: (theme) =>
                      theme.transitions.create("all", {
                        easing: theme.transitions.easing.easeInOut,
                        duration: theme.transitions.duration.shorter,
                      }),
                    ...(isSelected && { transform: "none" }),
                  }}
                />
              </BoxStyle>
            </Grid>
          );
        })}
      </Grid>
    </RadioGroup>
  );
}
