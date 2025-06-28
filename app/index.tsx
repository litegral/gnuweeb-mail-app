import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Button>
        <Text>Welcome!</Text>
      </Button>
    </View>
  );
}
