using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Video;

public class ShowVideo : MonoBehaviour
{
    VideoPlayer videoplayer;
    // Start is called before the first frame update
    void Start()
    {
        videoplayer = GetComponent<VideoPlayer>();
        videoplayer.url = System.IO.Path.Combine(Application.streamingAssetsPath, "worldmap.mp4");

    }
}
