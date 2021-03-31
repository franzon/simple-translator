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

      const result = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://translate.google.com/translate_a/single?client=at&dt=t&dt=ld&dt=qca&dt=rm&dt=bd&dj=1&hl=%25s&ie=UTF-8&oe=UTF-8&inputm=2&otf=2&iid=1dd3b944-fa62-4b55-b330-74909a99969e&${queryParams}`)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'AndroidTranslate/5.3.0.RC02.130475354-53000263 5.1 phone TRANSLATE_OPM5_TEST_1',
          },
        });

      const { contents } = await result.json();

      const { sentences } = JSON.parse(contents);
      const { trans } = sentences[0];

      setTranslatedText(trans);
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
