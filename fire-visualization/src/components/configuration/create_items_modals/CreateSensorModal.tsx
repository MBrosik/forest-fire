import { useRef } from 'react';
import { Modal, Typography, Stack, Button, Box } from '@mui/material';
import { Form, Formik, FormikProps } from 'formik';
import { MapWrapper } from '../../maps/MapWrapper';
import { Sensor, getDefaultSensor } from '../../../model/sensor';
import { SensorForm } from '../sensorlike_forms/SensorForm';
import { AddLocationMap } from '../../maps/AddLocationMap';

type CreateSensorModalProps = {
  isOpen: boolean;
  handleSubmit: (values: Sensor) => Promise<void>;
  closeModal: () => void;
};

export const CreateSensorModal = ({ isOpen, handleSubmit, closeModal }: CreateSensorModalProps) => {
  const sensorFormRef = useRef<FormikProps<Sensor> | null>(null);

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
        <Typography variant="h2">New sensor</Typography>

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
            initialValues={{ ...getDefaultSensor() }}
            innerRef={sensorFormRef}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form>
                <Stack spacing={2}>
                  <SensorForm />

                  <Typography variant="h4">Sensor location</Typography>
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

        <Button onClick={async () => await sensorFormRef.current?.submitForm()}>Create</Button>
        <Button onClick={closeModal}>Cancel</Button>
      </Box>
    </Modal>
  );
};
