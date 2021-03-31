import { ArrowRightIcon } from '@chakra-ui/icons';
import {
  Box, Center, Container, Flex, Grid, Spinner, Textarea,
  Text,
  Stack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import './App.css';

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

function App() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');

  async function translateText(text) {
    setIsTranslating(true);

    try {
      const queryParams = new URLSearchParams({
        sl: 'en',
        tl: 'pt',
        q: text,
      });

      // Created a proxy server to avoid CORS problem.
      const result = await fetch(`http://68.183.139.12:7777/translate?${queryParams}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'AndroidTranslate/5.3.0.RC02.130475354-53000263 5.1 phone TRANSLATE_OPM5_TEST_1',
          },
        });

      const { text: translated } = await result.json();

      setTranslatedText(translated);
    } catch (error) {
      setTranslatedText('Error translating text.');
    } finally {
      setIsTranslating(false);
    }
  }

  function onChange(event) {
    const { value } = event.target;

    translateText(value);
  }

  return (
    <Container maxWidth="100%" padding="20">
      <Center marginBottom="20">
        <Stack textAlign="center">
          <Text fontSize="3xl">Simple Translator</Text>
          <Text>English -&gt; Portuguese (BR)</Text>
        </Stack>
      </Center>
      <Flex justifyContent="center" alignItems="center" height="100%">
        <Center flex="1">
          <Grid
            templateColumns="1fr 60px 1fr"
            gap={10}
            width="80%"
          >
            <Box height="600px">
              <Textarea
                onChange={debounce(onChange)}
                width="100%"
                height="100%"
                resize="none"
                placeholder="Original text"
              />
            </Box>
            <Center>
              <Container textAlign="center">
                <Spinner visibility={isTranslating ? 'visible' : 'hidden'} />
                <ArrowRightIcon marginTop="10" />
              </Container>
            </Center>
            <Box height="600px">
              <Textarea
                width="100%"
                height="100%"
                resize="none"
                placeholder="Translated text"
                value={translatedText}
                disabled
              />
            </Box>
          </Grid>
        </Center>
      </Flex>
    </Container>
  );
}

export default App;
