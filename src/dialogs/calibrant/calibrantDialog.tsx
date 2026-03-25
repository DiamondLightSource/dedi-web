import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { Calibrant } from "../../utils/types";
import { secondaryButtonSx } from "../../utils/styles";

interface CalibrantDialogProps {
  open: boolean;
  handleClose: () => void;
  calibrantRecord: Record<string, Calibrant>;
  userCalibrantNames: Set<string>;
  onDelete: (name: string) => void;
}

/**
 * Read-only dialog showing all calibrants with their d-spacing rings.
 */
export function CalibrantDialog({
  open,
  handleClose,
  calibrantRecord,
  userCalibrantNames,
  onDelete,
}: CalibrantDialogProps) {
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        variant="h5"
        fontWeight={600}
        sx={{
          bgcolor: "grey.100",
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          py: 1.5,
        }}
      >
        Calibrants
        <IconButton onClick={handleClose} sx={{ ml: "auto" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Rings
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  d min (nm)
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  d max (nm)
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>d-spacings (nm)</TableCell>
                <TableCell sx={{ width: 40 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(calibrantRecord).map(([name, calibrant]) => {
                const sorted = [...calibrant.d].sort((a, b) => a - b);
                const dMin = sorted[0];
                const dMax = sorted[sorted.length - 1];
                const allD = [...calibrant.d]
                  .sort((a, b) => b - a)
                  .map((d) => d.toPrecision(4))
                  .join(", ");
                return (
                  <TableRow key={name} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {calibrant.d.length}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {dMin.toPrecision(4)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {dMax.toPrecision(4)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 320 }}>
                      <Tooltip title={allD} placement="top-start">
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ color: "text.secondary", cursor: "default" }}
                        >
                          {allD}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ p: 0.5 }}>
                      {userCalibrantNames.has(name) && (
                        <Tooltip title="Delete" placement="left">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(name)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}

interface AddCalibrantDialogProps {
  open: boolean;
  handleClose: () => void;
  onAdd: (name: string, calibrant: Calibrant) => void;
}

/**
 * Parses a comma/whitespace-separated string of numbers into an array.
 * Returns null if any token is not a positive finite number.
 */
function parseDSpacings(raw: string): number[] | null {
  const tokens = raw.split(/[\s,]+/).filter(Boolean);
  if (tokens.length === 0) return null;
  const values = tokens.map(Number);
  if (values.some((v) => !isFinite(v) || v <= 0)) return null;
  return values;
}

/**
 * Form dialog for adding a custom calibrant with user-supplied d-spacings.
 */
export function AddCalibrantDialog({
  open,
  handleClose,
  onAdd,
}: AddCalibrantDialogProps) {
  const [name, setName] = useState("");
  const [dRaw, setDRaw] = useState("");

  const dValues = parseDSpacings(dRaw);
  const nameError = name.trim() === "" ? "Name is required" : null;
  const dError =
    dRaw.trim() === ""
      ? "At least one d-spacing is required"
      : dValues === null
        ? "All values must be positive numbers"
        : null;

  const canSubmit = nameError === null && dError === null;

  const handleSubmit = () => {
    if (!canSubmit || dValues === null) return;
    onAdd(name.trim(), { d: dValues });
    setName("");
    setDRaw("");
    handleClose();
  };

  const handleCancel = () => {
    setName("");
    setDRaw("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle
        variant="h5"
        fontWeight={600}
        sx={{
          bgcolor: "grey.100",
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          py: 1.5,
        }}
      >
        Add calibrant
        <IconButton onClick={handleCancel} sx={{ ml: "auto" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 2 }}>
          <TextField
            label="Name"
            size="small"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={name.trim() !== "" && nameError !== null}
            helperText={name.trim() !== "" ? nameError : undefined}
          />
          <TextField
            label="d-spacings (nm)"
            size="small"
            fullWidth
            multiline
            minRows={3}
            value={dRaw}
            onChange={(e) => setDRaw(e.target.value)}
            placeholder="e.g. 0.314, 0.192, 0.163"
            error={dRaw.trim() !== "" && dError !== null}
            helperText={
              dRaw.trim() !== "" && dError
                ? dError
                : "Comma or space separated, in nanometres, largest first"
            }
          />
          <Button
            variant="outlined"
            sx={secondaryButtonSx}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Add calibrant
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
