import { useRef } from 'react';
import { Modal, Typography, Stack, Button, Box } from '@mui/material';
import { Form, Formik, FormikProps } from 'formik';
import { MapWrapper } from '../../maps/MapWrapper';
import { FireBrigade, getDefaultFireBrigade } from '../../../model/FireBrigade';
import { FireBrigadeForm } from '../sensorlike_forms/FireBrigadeForm';
import { AddLocationMap } from '../../maps/AddLocationMap';

type CreateFireBrigadeModalProps = {
  isOpen: boolean;
  handleSubmit: (values: FireBrigade) => Promise<void>;
  closeModal: () => void;
};

export const CreateFireBrigadeModal = ({ isOpen, handleSubmit, closeModal }: CreateFireBrigadeModalProps) => {
  const fireBrigadeFormRef = useRef<FormikProps<FireBrigade> | null>(null);

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
        <Typography variant="h2">New fire brigade</Typography>

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
            initialValues={{ ...getDefaultFireBrigade() }}
            innerRef={fireBrigadeFormRef}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form>
                <Stack spacing={2}>
                  <FireBrigadeForm />

                  <Typography variant="h4">Fire brigade base location</Typography>
                  <MapWrapper>
                    <AddLocationMap
                      handleSelectedLocation={(location) => {
                        setFieldValue('baseLocation', location);
                        setFieldValue('currentLocation', location);
                      }}
                    />
                  </MapWrapper>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>

        <Button onClick={async () => await fireBrigadeFormRef.current?.submitForm()}>Create</Button>
        <Button onClick={closeModal}>Cancel</Button>
      </Box>
    </Modal>
  );
};
