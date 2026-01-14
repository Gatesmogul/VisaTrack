
import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';

interface RecentCityCardProps {
    name: string;
    image: ImageSourcePropType;
    time: string;
}

const RecentCityCard: React.FC<RecentCityCardProps> = ({ name, image, time }) => {
    return (
        <View style={styles.card}>
            <Image source={image} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.time}>{time}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        width: 140,
        height: 160,
        borderRadius: 20,
        marginRight: 15,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
        justifyContent: 'space-between',
    },
    image: {
        width: '100%',
        height: 80,
        borderRadius: 15,
        resizeMode: 'cover',
    },
    textContainer: {
        marginTop: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    time: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
});

export default RecentCityCard;
