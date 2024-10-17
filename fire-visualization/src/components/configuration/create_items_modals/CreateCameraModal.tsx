import { useRef } from 'react';
import { Modal, Typography, Button, Box, Stack } from '@mui/material';
import { Form, Formik, FormikProps } from 'formik';
import { MapWrapper } from '../../maps/MapWrapper';
import { Camera, getDefaultCamera } from '../../../model/camera';
import { CameraForm } from '../sensorlike_forms/CameraForm';
import { AddLocationMap } from '../../maps/AddLocationMap';

type CreateCameraModalProps = {
  isOpen: boolean;
  handleSubmit: (values: Camera) => Promise<void>;
  closeModal: () => void;
};

export const CreateCameraModal = ({ isOpen, handleSubmit, closeModal }: CreateCameraModalProps) => {
  const cameraFormRef = useRef<FormikProps<Camera> | null>(null);

  return (
    <Modal
      open={isOpen}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'secondary.A100',
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h2">New camera</Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            mt: 2,
            borderColor: 'secondary.darker',
            width: '620px',
            overflow: 'scroll',
          }}
        >
          <Formik
            initialValues={{ ...getDefaultCamera() }}
            innerRef={cameraFormRef}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form>
                <Stack spacing={2}>
                  <CameraForm />

                  <Typography variant="h4">Camera location</Typography>
                  <MapWrapper>
                    <AddLocationMap
                      handleSelectedLocation={(location) => {
                        setFieldValue('location', location);
                      }}
                    />
                  </MapWrapper>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>

        <Button onClick={async () => await cameraFormRef.current?.submitForm()}>Create</Button>
        <Button onClick={closeModal}>Cancel</Button>
      </Box>
    </Modal>
  );
};
