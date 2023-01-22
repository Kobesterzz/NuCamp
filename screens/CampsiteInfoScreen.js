import { FlatList, StyleSheet, Text, View, Modal} from 'react-native';
import {Rating, Input, Button} from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux';
import RenderCampsite from '../features/campsites/renderCampsite';
import  {toggleFavorite}  from '../features/campsites/favorites/favoritesSlice';
import {useState} from 'react';
import {postComment} from '../features/campsites/comments/commentSlice'
import * as Animatable from 'react-native-animatable'


const CampsiteInfoScreen = ({ route }) => {
    const { campsite } = route.params;
    const comments = useSelector((state) => state.comments);
    const favorites = useSelector((state) => state.favorites);
    const dispatch = useDispatch(); 
    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [author, setAuthor] = useState('');
    const [text, setText] = useState('');

    
    const handleSubmit = () => {
        const newComment = {
            author,
            rating,
            text,
            campsiteId: campsite.id
        };
        dispatch(postComment(newComment));
        setShowModal(!showModal);
    }

    const resetForm = () => {
        setRating(5);
        setAuthor('');
        setText('');

    }

    const renderCommentItem = ({ item }) => {
        return (
            <View style={styles.commentItem}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>
                    {`-- ${item.author}, ${item.date}`}
                </Text>
            </View>
        );
    };


    return (
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>

            <FlatList
                data={comments.commentsArray.filter(
                    (comment) => comment.campsiteId === campsite.id
                )}
                renderItem={renderCommentItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    marginHorizontal: 20,
                    paddingVertical: 20
                }}
                ListHeaderComponent={
                    <>
                    <RenderCampsite
                            campsite={campsite}
                            isFavorite={favorites.includes(campsite.id)}
                            markFavorite={() => dispatch(toggleFavorite(campsite.id))}
                            onShowModal={() => setShowModal(!showModal)}
                        />    
                        <Text style={styles.commentsTitle}>Comments</Text>
                    </>
                }
            />

            <Modal
                animationType='slide'
                transparent={false}
                visible={showModal}
                onRequestClose={() => setShowModal(!showModal)}
            >
                <View style={styles.modal}>       
                        <View style={{margin:10}}>
                            <Rating
                            showRating
                            startingValue={rating}
                            imageSize={40}
                            onFinishRating={(rating) => setRating(rating)}
                            style={{ paddingVertical: 10 }}
                            ></Rating>
                            <Input
                            readonly
                            placeholder="Author"
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            onChangeText={(author) => setAuthor(author)}     
                            value={author}                       
                            ></Input>
                            <Input
                            placeholder="Comment"
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            onChangeText={(text) => setText(text)}  
                            value={text}                          
                            ></Input>
                            <View style={{margin:10}}>
                                <Button color='#5637DD' title='submit' onPress={() => {handleSubmit(); resetForm();}} >Submit</Button>
                            </View>
                            <View style={{margin:10}}>
                                <Button onPress={() => {setShowModal(!showModal); resetForm()}} color= '#808080' title="Cancel"/>
                            </View>
                        </View>                    
                </View>  
            </Modal>
        </Animatable.View>
    );


};



const styles = StyleSheet.create({
    commentsTitle: {
        textAlign: 'center',
        backgroundColor: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#43484D',
        padding: 10,
        paddingTop: 30
    },
    commentItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    modal: {
        justifyContent:'center',
        margin: 20,
    }
});

export default CampsiteInfoScreen;