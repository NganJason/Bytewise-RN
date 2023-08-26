import { useNavigation } from '@react-navigation/native';
import { Icon, useTheme } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BaseScreen, BaseText, BaseInput, BaseButton } from '../../Components';
import { useDimension } from '../../_shared/hooks';
import { useCreateFeedback } from '../../_shared/mutations/user';

const FeedbackForm = () => {
  const { theme } = useTheme();
  const { screenHeight } = useDimension();
  const styles = getStyles(theme, screenHeight);
  const navigation = useNavigation();
  const [feedback, setFeedback] = useState({
    score: 0,
    text: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const createFeedback = useCreateFeedback({
    onSuccess: () => {
      setIsSubmitted(true);
    },
  });

  const onScoreChange = e => {
    setFeedback({ ...feedback, score: e });
  };

  const onInputChange = e => {
    setFeedback({ ...feedback, text: e });
  };

  const onSubmit = () => {
    if (isSubmitted) {
      navigation.goBack();
      return;
    }
    createFeedback.mutate(feedback);
  };

  return (
    <BaseScreen headerProps={{ allowBack: true }}>
      <View style={styles.screen}>
        {isSubmitted ? (
          <>
            <BaseText h2>Thanks for the feedback!</BaseText>
            <BaseText text2 margin={{ top: 10 }}>
              We'll continue to work on improving your experience!
            </BaseText>
          </>
        ) : (
          <>
            <BaseText h2>Your feedback matters</BaseText>
            <BaseText text2 color={theme.colors.color8} margin={{ top: 10 }}>
              Let us know how we can improve
            </BaseText>
            <Ratings onScoreChange={onScoreChange} />

            <View style={styles.input}>
              <BaseInput
                multiline
                longText
                placeholder="Tell us more..."
                onChangeText={onInputChange}
                value={feedback.text}
                scrollEnabled
              />
            </View>
          </>
        )}

        <View style={styles.btnContainer}>
          <BaseButton
            title={isSubmitted ? 'Back' : 'Submit'}
            size="lg"
            width={200}
            onPress={onSubmit}
            loading={createFeedback.isLoading}
          />
        </View>
      </View>
    </BaseScreen>
  );
};

const Ratings = ({ onScoreChange = function (score) {} }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [score, setScore] = useState(2);

  const emojis = [
    { type: 'entypo', name: 'emoji-sad' },
    { type: 'entypo', name: 'emoji-neutral' },
    { type: 'entypo', name: 'emoji-happy' },
  ];

  const onPress = idx => {
    setScore(idx);
  };
  useEffect(() => {
    onScoreChange(score);
  }, [score]);

  return (
    <View style={styles.rating}>
      {emojis.map((emoji, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => {
            onPress(idx);
          }}>
          <Icon
            key={idx}
            type={emoji.type}
            name={emoji.name}
            size={34}
            style={[styles.icon, idx === score && styles.activeIcon]}
            color={idx === score ? theme.colors.color1 : theme.colors.color7}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getStyles = (theme, screenHeight) => {
  return StyleSheet.create({
    screen: {
      flex: 1,
      paddingTop: screenHeight * 0.05,
    },
    rating: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 30,
    },
    icon: {
      marginHorizontal: 10,
      padding: 8,
      borderRadius: 100,
    },
    activeIcon: {
      backgroundColor: theme.colors.color3,
    },
    btnContainer: {
      marginTop: 40,
    },
  });
};

export default FeedbackForm;
